import os
import sys


def search_word_in_files(target_word, directory='.'):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', errors='ignore') as f:
                    for line_num, line in enumerate(f, start=1):
                        if target_word in line:
                            print(f"Found in {file_path} at line {
                                  line_num}: {line.strip()}")
            except (IOError, OSError):
                print(f"Could not read file: {file_path}")


if __name__ == "__main__":
    target_word = "onSendMessage"
    search_word_in_files(target_word)
