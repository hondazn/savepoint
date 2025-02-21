# MacOS

## [Homebrew](https://brew.sh/)のインストール
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Homebrewでインストールするもの
```sh
brew install \
    fd \
    fish \
    fisher \
    fzf \
    gh \
    ghq \
    git \
    git-delta \
    lazygit \
    mise \
    neovim \
    ripgrep \
    skhd \
    sqlite \
    starship \
    stylua \
    tmux \
    tree-sitter \
    yabai \
    alacritty \
    arc \
    calendr \
    jordanbaird-ice \
    karabiner-elements \
    logi-options+ \
    obsidian \
    raycast \
    scroll-reverser \
    shottr \
```

## App Storeでインストールするもの
- [RunCat](https://apps.apple.com/jp/app/runcat/id1429033973)
- [Tailscale](https://apps.apple.com/ca/app/tailscale/id1475387142)

## Dockの設定
- 「Dockを自動的に表示/非表示」を**オン**にする
- Dock出現スピードを早くする
```sh
defaults write com.apple.Dock autohide-delay -float 0; defaults write com.apple.dock autohide-time-modifier -float 0.65; killall Dock
```
- 「ウインドウをアプリケーションアイコンにしまう」を**オン**にする
- 「アプリの提案と最近使用したアプリをDockに表示」を**オフ**にする
- マウスオーバーした時にアプリアイコンを拡大する

## Finderの設定
- メニューバー > 表示 で全てのバーを表示
- Finder > 設定 > 詳細 > 検索実行時 で現在のフォルダ内を検索
