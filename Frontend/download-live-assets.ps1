$ErrorActionPreference = 'Stop'
$base = 'https://vasavibhuvi.com/images'
$target = Join-Path $PSScriptRoot 'public/images/live-site'
New-Item -ItemType Directory -Force -Path $target | Out-Null
$files = @(
  @{ Name='block-entrance-6661678486813.webp'; Url="$base/new/block-entrance-6661678486813.webp" },
  @{ Name='744935165-swimming-pool.webp'; Url="$base/744935165-swimming-pool.webp" },
  @{ Name='744935245-cycling.webp'; Url="$base/744935245-cycling.webp" },
  @{ Name='744936107-supermarket.webp'; Url="$base/744936107-supermarket.webp" },
  @{ Name='744936016-indoor-games.webp'; Url="$base/744936016-indoor-games.webp" },
  @{ Name='744935622-security.webp'; Url="$base/744935622-security.webp" },
  @{ Name='744935391-gym.webp'; Url="$base/744935391-gym.webp" },
  @{ Name='744935449-yoga.webp'; Url="$base/744935449-yoga.webp" },
  @{ Name='744936208-shuttle.webp'; Url="$base/744936208-shuttle.webp" },
  @{ Name='744935326-business.webp'; Url="$base/744935326-business.webp" },
  @{ Name='Walker.webp'; Url="$base/Walker.webp" },
  @{ Name='744935719-banquet-hall.webp'; Url="$base/744935719-banquet-hall.webp" },
  @{ Name='744935562-basket-ball.webp'; Url="$base/744935562-basket-ball.webp" },
  @{ Name='744935277-cricket.webp'; Url="$base/744935277-cricket.webp" }
)
foreach ($file in $files) {
  $destination = Join-Path $target $file.Name
  Write-Host "Downloading $($file.Name)..."
  Invoke-WebRequest -Uri $file.Url -OutFile $destination
}
Write-Host "Done. Live assets are in $target"
