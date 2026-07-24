cmake_minimum_required(VERSION 3.15)
project(pi-listener CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

set(WHISPER_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../whisper.cpp)

# libwhisper only; no upstream examples, tests, or SDL wiring
set(WHISPER_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(WHISPER_BUILD_TESTS    OFF CACHE BOOL "" FORCE)
set(WHISPER_BUILD_SERVER   OFF CACHE BOOL "" FORCE)
add_subdirectory(${WHISPER_DIR} whisper.cpp EXCLUDE_FROM_ALL)

find_package(SDL2 REQUIRED)
find_package(Threads REQUIRED)
string(STRIP "${SDL2_LIBRARIES}" SDL2_LIBRARIES)

add_executable(pi-listener
    pi-listener.cpp
    ${WHISPER_DIR}/examples/common.cpp
    ${WHISPER_DIR}/examples/common-sdl.cpp
)

target_include_directories(pi-listener PRIVATE
    ${WHISPER_DIR}/examples
    ${SDL2_INCLUDE_DIRS}
)

target_link_libraries(pi-listener PRIVATE
    whisper
    ${SDL2_LIBRARIES}
    Threads::Threads
)
