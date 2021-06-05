---
date: 2021-06-05 23:09:26
updated: 2021-06-05 23:09:26
md5: '158a24ccb601f901a24dee4ff0767581'
---

# Linux疑难杂症

1. **man-db崩溃**
    1. **错误**：`man: preconv: Bad system call (core dumped)`
    2. **解决**：`echo "export MAN_DISABLE_SECCOMP=1" >> ~/.zshrc`
2. **谷歌拼音突然失效**
    1. **解决**：`rm -rf ~/.config/fcitx`
3. **apt dpkg问题**
    1. **错误**：`Unable to acquire the dpkg frontend lock`
    2. **解决**
        ```bash
        systemctl stop apt-daily.timer
        systemctl disable apt-daily.timer
        systemctl mask apt-daily.service
        systemctl daemon-reload
        ```

4. **Ubuntu开机检测到系统程序错误**
    1. **解决**：`sudo rm /var/crash/*`
5. **oh-my-zsh在较大git项目下卡顿**
    1. **解决**
        ```bash
        git config --global oh-my-zsh.hide-status=1
        git config --global oh-my-zsh.hide-dirty=1
        ```
