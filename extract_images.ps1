$urls = @(
    'https://mvsrec.edu.in/',
    'https://mvsrec.edu.in/index.php?option=com_content&view=article&id=655&Itemid=1233',
    'https://mvsrec.edu.in/index.php?option=com_content&view=article&id=648&Itemid=1228'
)
$allImages = @()
foreach ($url in $urls) {
    try {
        $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10).Content
        $pattern = 'src="([^"]+?\.(jpg|jpeg|png|gif|webp))"'
        $matches = [regex]::Matches($html, $pattern, 'IgnoreCase')
        foreach ($m in $matches) {
            $imgUrl = $m.Groups[1].Value
            if ($imgUrl -notmatch '^http') {
                $imgUrl = "https://mvsrec.edu.in" + $imgUrl
            }
            if ($imgUrl -match '/images/' -and $imgUrl -notmatch 'logo|blank|tree|top\.png|arrow') {
                $allImages += $imgUrl
            }
        }
    } catch { }
}
$allImages | Select-Object -Unique
