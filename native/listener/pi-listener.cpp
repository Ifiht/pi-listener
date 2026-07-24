// pi-listener: hands-free wake-word listener for the pi agent.
//
// Forked from whisper.cpp/examples/command (MIT), always-prompt mode.
// Continuously captures mic audio, VAD-gates it, transcribes utterances,
// and scans for a wake word. Emits JSON lines on stdout:
//
//   {"type":"ready"}                     model loaded, listening
//   {"type":"wake_only"}                 wake word heard; follow-up window opened
//   {"type":"command","text":"..."}      instruction (same utterance or follow-up)
//
// After a bare wake word, the next utterance within --follow-ms is taken as
// the command without needing the wake word again. An optional --chime WAV
// is played (via SDL) when the follow-up window opens.
//
// stdin protocol (one command per line): PAUSE / RESUME. EOF exits.

#include "common-sdl.h"
#include "common.h"
#include "whisper.h"

#include <atomic>
#include <cctype>
#include <chrono>
#include <cstdio>
#include <iostream>
#include <regex>
#include <string>
#include <thread>
#include <vector>

struct listener_params {
    int32_t n_threads  = std::min(4, (int32_t) std::thread::hardware_concurrency());
    int32_t command_ms = 8000;
    int32_t follow_ms  = 8000;
    int32_t capture_id = -1;
    int32_t max_tokens = 32;
    int32_t audio_ctx  = 0;

    float vad_thold  = 0.6f;
    float freq_thold = 100.0f;

    bool print_energy = false;
    bool use_gpu      = true;
    bool flash_attn   = true;

    std::string language = "en";
    std::string model    = "models/ggml-base.en.bin";
    std::string wake;
    std::string chime;
};

static void print_usage(const char * prog, const listener_params & params) {
    fprintf(stderr, "\n");
    fprintf(stderr, "usage: %s --wake WORD [options]\n", prog);
    fprintf(stderr, "\n");
    fprintf(stderr, "options:\n");
    fprintf(stderr, "  -h,       --help          show this help message and exit\n");
    fprintf(stderr, "  --wake WORD               [required] wake word to listen for\n");
    fprintf(stderr, "  -t N,     --threads N     [%-7d] number of threads\n", params.n_threads);
    fprintf(stderr, "  -cms N,   --command-ms N  [%-7d] command duration in milliseconds\n", params.command_ms);
    fprintf(stderr, "  -fms N,   --follow-ms N   [%-7d] follow-up window after bare wake word (ms)\n", params.follow_ms);
    fprintf(stderr, "  --chime FNAME             [%-7s] WAV to play when follow-up window opens\n", params.chime.c_str());
    fprintf(stderr, "  -c ID,    --capture ID    [%-7d] capture device ID\n", params.capture_id);
    fprintf(stderr, "  -mt N,    --max-tokens N  [%-7d] maximum tokens per audio chunk\n", params.max_tokens);
    fprintf(stderr, "  -ac N,    --audio-ctx N   [%-7d] audio context size (0 - all)\n", params.audio_ctx);
    fprintf(stderr, "  -vth N,   --vad-thold N   [%-7.2f] VAD threshold\n", params.vad_thold);
    fprintf(stderr, "  -fth N,   --freq-thold N  [%-7.2f] high-pass frequency cutoff\n", params.freq_thold);
    fprintf(stderr, "  -pe,      --print-energy  [%-7s] print sound energy (debug)\n", params.print_energy ? "true" : "false");
    fprintf(stderr, "  -ng,      --no-gpu        [%-7s] disable GPU\n", params.use_gpu ? "false" : "true");
    fprintf(stderr, "  -l LANG,  --language LANG [%-7s] spoken language\n", params.language.c_str());
    fprintf(stderr, "  -m FNAME, --model FNAME   [%-7s] model path\n", params.model.c_str());
    fprintf(stderr, "\n");
}

static bool params_parse(int argc, char ** argv, listener_params & params) {
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];

        if (arg == "-h" || arg == "--help") {
            print_usage(argv[0], params);
            exit(0);
        }
        else if (arg == "--wake")                            { params.wake         = argv[++i]; }
        else if (arg == "-t"   || arg == "--threads")        { params.n_threads    = std::stoi(argv[++i]); }
        else if (arg == "-cms" || arg == "--command-ms")     { params.command_ms   = std::stoi(argv[++i]); }
        else if (arg == "-fms" || arg == "--follow-ms")      { params.follow_ms    = std::stoi(argv[++i]); }
        else if (arg == "--chime")                           { params.chime        = argv[++i]; }
        else if (arg == "-c"   || arg == "--capture")        { params.capture_id   = std::stoi(argv[++i]); }
        else if (arg == "-mt"  || arg == "--max-tokens")     { params.max_tokens   = std::stoi(argv[++i]); }
        else if (arg == "-ac"  || arg == "--audio-ctx")      { params.audio_ctx    = std::stoi(argv[++i]); }
        else if (arg == "-vth" || arg == "--vad-thold")      { params.vad_thold    = std::stof(argv[++i]); }
        else if (arg == "-fth" || arg == "--freq-thold")     { params.freq_thold   = std::stof(argv[++i]); }
        else if (arg == "-pe"  || arg == "--print-energy")   { params.print_energy = true; }
        else if (arg == "-ng"  || arg == "--no-gpu")         { params.use_gpu      = false; }
        else if (arg == "-l"   || arg == "--language")       { params.language     = argv[++i]; }
        else if (arg == "-m"   || arg == "--model")          { params.model        = argv[++i]; }
        else {
            fprintf(stderr, "error: unknown argument: %s\n", arg.c_str());
            print_usage(argv[0], params);
            return false;
        }
    }

    if (params.wake.empty()) {
        fprintf(stderr, "error: --wake is required\n");
        print_usage(argv[0], params);
        return false;
    }

    return true;
}

static std::string json_escape(const std::string & s) {
    std::string out;
    out.reserve(s.size());
    for (const char c : s) {
        switch (c) {
            case '"':  out += "\\\""; break;
            case '\\': out += "\\\\"; break;
            case '\n': out += "\\n";  break;
            case '\r': out += "\\r";  break;
            case '\t': out += "\\t";  break;
            default:
                if ((unsigned char) c < 0x20) {
                    char buf[8];
                    snprintf(buf, sizeof(buf), "\\u%04x", c);
                    out += buf;
                } else {
                    out += c;
                }
        }
    }
    return out;
}

static void emit(const std::string & type, const std::string & text = "") {
    if (text.empty()) {
        fprintf(stdout, "{\"type\":\"%s\"}\n", type.c_str());
    } else {
        fprintf(stdout, "{\"type\":\"%s\",\"text\":\"%s\"}\n", type.c_str(), json_escape(text).c_str());
    }
    fflush(stdout);
}

static std::string lowercase(const std::string & s) {
    std::string out = s;
    for (char & c : out) {
        c = std::tolower((unsigned char) c);
    }
    return out;
}

// Scan txt for the wake word (case-insensitive, word-boundary match).
// Returns true on match; command receives the trimmed text after the wake word.
static bool extract_command(const std::string & txt, const std::string & wake, std::string & command) {
    const std::string ltxt  = lowercase(txt);
    const std::string lwake = lowercase(wake);

    size_t pos = 0;
    while ((pos = ltxt.find(lwake, pos)) != std::string::npos) {
        const bool start_ok = pos == 0 || !std::isalnum((unsigned char) ltxt[pos - 1]);
        const size_t end = pos + lwake.size();
        const bool end_ok = end >= ltxt.size() || !std::isalnum((unsigned char) ltxt[end]);
        if (start_ok && end_ok) {
            size_t i = end;
            while (i < txt.size() && (std::isspace((unsigned char) txt[i]) || std::ispunct((unsigned char) txt[i]))) {
                i++;
            }
            command = ::trim(txt.substr(i));
            return true;
        }
        pos = end;
    }

    return false;
}

// Drop whisper non-speech annotations like "[ Silence ]" or "(wind blowing)".
static std::string strip_annotations(const std::string & txt) {
    static const std::regex re("\\[.*?\\]|\\(.*?\\)");
    return ::trim(std::regex_replace(txt, re, ""));
}

// Chime playback via SDL (already initialized for capture).
struct chime_player {
    SDL_AudioDeviceID dev = 0;
    uint8_t * buf = nullptr;
    uint32_t  len = 0;
    int       dur_ms = 0;

    bool init(const std::string & path) {
        SDL_AudioSpec spec;
        if (SDL_LoadWAV(path.c_str(), &spec, &buf, &len) == nullptr) {
            fprintf(stderr, "chime: failed to load '%s': %s\n", path.c_str(), SDL_GetError());
            return false;
        }
        dev = SDL_OpenAudioDevice(nullptr, 0, &spec, nullptr, 0);
        if (dev == 0) {
            fprintf(stderr, "chime: failed to open playback device: %s\n", SDL_GetError());
            SDL_FreeWAV(buf);
            buf = nullptr;
            return false;
        }
        const uint32_t bytes_per_sec = spec.freq * spec.channels * (SDL_AUDIO_BITSIZE(spec.format) / 8);
        dur_ms = bytes_per_sec > 0 ? (int) (1000ull * len / bytes_per_sec) : 0;
        SDL_PauseAudioDevice(dev, 0);
        return true;
    }

    // wozniak: blocks for the chime duration so the caller can clear the mic
    // buffer afterwards, keeping the chime out of the next transcription.
    // Fine for short chimes; async playback + echo handling is the upgrade path.
    void play() const {
        if (dev == 0) {
            return;
        }
        SDL_ClearQueuedAudio(dev);
        SDL_QueueAudio(dev, buf, len);
        std::this_thread::sleep_for(std::chrono::milliseconds(dur_ms + 50));
    }

    ~chime_player() {
        if (dev != 0) {
            SDL_CloseAudioDevice(dev);
        }
        if (buf != nullptr) {
            SDL_FreeWAV(buf);
        }
    }
};

static std::string transcribe(
                 whisper_context * ctx,
          const listener_params & params,
        const std::vector<float> & pcmf32) {
    whisper_full_params wparams = whisper_full_default_params(WHISPER_SAMPLING_BEAM_SEARCH);

    wparams.print_progress   = false;
    wparams.print_special    = false;
    wparams.print_realtime   = false;
    wparams.print_timestamps = false;
    wparams.translate        = false;
    wparams.no_context       = true;
    wparams.no_timestamps    = true;
    wparams.single_segment   = true;
    wparams.max_tokens       = params.max_tokens;
    wparams.language         = params.language.c_str();
    wparams.n_threads        = params.n_threads;
    wparams.audio_ctx        = params.audio_ctx;

    wparams.temperature     = 0.4f;
    wparams.temperature_inc = 1.0f;
    wparams.greedy.best_of  = 5;

    wparams.beam_search.beam_size = 5;

    if (whisper_full(ctx, wparams, pcmf32.data(), pcmf32.size()) != 0) {
        return "";
    }

    std::string result;
    const int n_segments = whisper_full_n_segments(ctx);
    for (int i = 0; i < n_segments; ++i) {
        result += whisper_full_get_segment_text(ctx, i);
    }

    return result;
}

// stdin control: PAUSE / RESUME set the desired state; EOF requests shutdown.
static std::atomic<bool> g_want_paused{false};
static std::atomic<bool> g_stdin_eof{false};

static void stdin_control_loop() {
    std::string line;
    while (std::getline(std::cin, line)) {
        const std::string cmd = ::trim(line);
        if (cmd == "PAUSE") {
            g_want_paused = true;
        } else if (cmd == "RESUME") {
            g_want_paused = false;
        } else if (!cmd.empty()) {
            fprintf(stderr, "%s: ignoring unknown control command '%s'\n", __func__, cmd.c_str());
        }
    }
    g_stdin_eof = true;
}

int main(int argc, char ** argv) {
    ggml_backend_load_all();

    listener_params params;

    if (!params_parse(argc, argv, params)) {
        return 1;
    }

    if (whisper_lang_id(params.language.c_str()) == -1) {
        fprintf(stderr, "error: unknown language '%s'\n", params.language.c_str());
        return 1;
    }

    struct whisper_context_params cparams = whisper_context_default_params();
    cparams.use_gpu    = params.use_gpu;
    cparams.flash_attn = params.flash_attn;

    struct whisper_context * ctx = whisper_init_from_file_with_params(params.model.c_str(), cparams);
    if (ctx == nullptr) {
        fprintf(stderr, "error: failed to initialize whisper context\n");
        return 2;
    }

    if (!whisper_is_multilingual(ctx) && params.language != "en") {
        params.language = "en";
        fprintf(stderr, "%s: WARNING: model is not multilingual, forcing language to 'en'\n", __func__);
    }

    audio_async audio(30*1000);
    if (!audio.init(params.capture_id, WHISPER_SAMPLE_RATE)) {
        fprintf(stderr, "%s: audio.init() failed!\n", __func__);
        whisper_free(ctx);
        return 1;
    }

    audio.resume();

    // wait for 1 second to avoid any buffered noise
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    audio.clear();

    chime_player chime;
    if (!params.chime.empty()) {
        chime.init(params.chime);
    }

    std::thread(stdin_control_loop).detach();

    fprintf(stderr, "%s: listening for wake word '%s' ...\n", __func__, params.wake.c_str());
    emit("ready");

    bool is_running = true;
    bool paused     = false;
    bool awaiting   = false;

    auto t_wake = std::chrono::steady_clock::now();

    std::vector<float> pcmf32_cur;

    while (is_running) {
        is_running = sdl_poll_events() && !g_stdin_eof;
        if (!is_running) {
            break;
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(100));

        if (g_want_paused != paused) {
            paused = g_want_paused;
            if (paused) {
                audio.pause();
                audio.clear();
                fprintf(stderr, "%s: paused\n", __func__);
            } else {
                audio.clear();
                audio.resume();
                fprintf(stderr, "%s: resumed\n", __func__);
            }
        }

        if (paused) {
            awaiting = false;
            continue;
        }

        if (awaiting && std::chrono::duration_cast<std::chrono::milliseconds>(
                std::chrono::steady_clock::now() - t_wake).count() > params.follow_ms) {
            awaiting = false;
            fprintf(stderr, "%s: follow-up window expired\n", __func__);
        }

        audio.get(2000, pcmf32_cur);

        if (::vad_simple(pcmf32_cur, WHISPER_SAMPLE_RATE, 1000, params.vad_thold, params.freq_thold, params.print_energy)) {
            fprintf(stderr, "%s: speech detected, processing ...\n", __func__);

            audio.get(params.command_ms, pcmf32_cur);

            const std::string txt = ::trim(transcribe(ctx, params, pcmf32_cur));
            fprintf(stderr, "%s: heard '%s'\n", __func__, txt.c_str());

            std::string command;
            if (extract_command(txt, params.wake, command)) {
                if (command.empty()) {
                    emit("wake_only");
                    chime.play();
                    awaiting = true;
                    t_wake   = std::chrono::steady_clock::now();
                } else {
                    emit("command", command);
                    awaiting = false;
                }
            } else if (awaiting) {
                const std::string clean = strip_annotations(txt);
                if (!clean.empty()) {
                    emit("command", clean);
                    awaiting = false;
                }
            }

            audio.clear();
        }
    }

    audio.pause();
    whisper_print_timings(ctx);
    whisper_free(ctx);

    return 0;
}
