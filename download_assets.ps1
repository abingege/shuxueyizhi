# 创建资源目录
New-Item -ItemType Directory -Force -Path "assets/images"
New-Item -ItemType Directory -Force -Path "assets/sounds"

# 下载图片资源
$imageUrls = @{
    "forest-bg.png" = "https://raw.githubusercontent.com/example/assets/main/forest-bg.png"
    "fox.png" = "https://raw.githubusercontent.com/example/assets/main/fox.png"
    "sound-on.png" = "https://raw.githubusercontent.com/example/assets/main/sound-on.png"
    "sound-off.png" = "https://raw.githubusercontent.com/example/assets/main/sound-off.png"
}

foreach ($image in $imageUrls.GetEnumerator()) {
    $outputFile = "assets/images/$($image.Key)"
    Write-Host "Downloading $($image.Key)..."
    Invoke-WebRequest -Uri $image.Value -OutFile $outputFile
}

# 下载音效资源
$soundUrls = @{
    "correct.mp3" = "https://raw.githubusercontent.com/example/assets/main/correct.mp3"
    "wrong.mp3" = "https://raw.githubusercontent.com/example/assets/main/wrong.mp3"
    "click.mp3" = "https://raw.githubusercontent.com/example/assets/main/click.mp3"
    "level-complete.mp3" = "https://raw.githubusercontent.com/example/assets/main/level-complete.mp3"
    "game-complete.mp3" = "https://raw.githubusercontent.com/example/assets/main/game-complete.mp3"
    "background-music.mp3" = "https://raw.githubusercontent.com/example/assets/main/background-music.mp3"
}

foreach ($sound in $soundUrls.GetEnumerator()) {
    $outputFile = "assets/sounds/$($sound.Key)"
    Write-Host "Downloading $($sound.Key)..."
    Invoke-WebRequest -Uri $sound.Value -OutFile $outputFile
} 