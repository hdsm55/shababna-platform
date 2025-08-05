# PowerShell script for testing frontend deployment
# Test SPA routing and API connectivity

Write-Host "🚀 بدء اختبار Frontend Deployment..." -ForegroundColor Green

# Test URLs
$testUrls = @(
    "http://localhost:5173",
    "http://localhost:5173/programs",
    "http://localhost:5173/programs/1",
    "http://localhost:5173/events",
    "http://localhost:5173/events/1",
    "http://localhost:5173/blogs",
    "http://localhost:5173/blogs/1",
    "http://localhost:5173/contact",
    "http://localhost:5173/donations",
    "http://localhost:5173/join-us",
    "http://localhost:5173/volunteers",
    "http://localhost:5173/dashboard"
)

# API endpoints to test
$apiEndpoints = @(
    "https://shababna-backend.onrender.com/api/health",
    "https://shababna-backend.onrender.com/api/events",
    "https://shababna-backend.onrender.com/api/programs",
    "https://shababna-backend.onrender.com/api/blogs",
    "https://shababna-backend.onrender.com/api/forms/contact-forms"
)

Write-Host "`n📋 اختبار SPA Routing..." -ForegroundColor Yellow

$routingSuccess = 0
$routingFailed = 0

foreach ($url in $testUrls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url" -ForegroundColor Green
            $routingSuccess++
        }
        else {
            Write-Host "❌ $url (Status: $($response.StatusCode))" -ForegroundColor Red
            $routingFailed++
        }
    }
    catch {
        Write-Host "❌ $url (Error: $($_.Exception.Message))" -ForegroundColor Red
        $routingFailed++
    }
}

Write-Host "`n📋 اختبار API Connectivity..." -ForegroundColor Yellow

$apiSuccess = 0
$apiFailed = 0

foreach ($endpoint in $apiEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec 15
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $endpoint" -ForegroundColor Green
            $apiSuccess++
        }
        else {
            Write-Host "❌ $endpoint (Status: $($response.StatusCode))" -ForegroundColor Red
            $apiFailed++
        }
    }
    catch {
        Write-Host "❌ $endpoint (Error: $($_.Exception.Message))" -ForegroundColor Red
        $apiFailed++
    }
}

Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "📊 النتائج النهائية:" -ForegroundColor White
Write-Host "="*50 -ForegroundColor Cyan

Write-Host "`n🌐 SPA Routing:" -ForegroundColor Yellow
Write-Host "✅ نجح: $routingSuccess" -ForegroundColor Green
Write-Host "❌ فشل: $routingFailed" -ForegroundColor Red
Write-Host "📈 نسبة النجاح: $([math]::Round(($routingSuccess / ($routingSuccess + $routingFailed)) * 100))%" -ForegroundColor Cyan

Write-Host "`n🔌 API Connectivity:" -ForegroundColor Yellow
Write-Host "✅ نجح: $apiSuccess" -ForegroundColor Green
Write-Host "❌ فشل: $apiFailed" -ForegroundColor Red
Write-Host "📈 نسبة النجاح: $([math]::Round(($apiSuccess / ($apiSuccess + $apiFailed)) * 100))%" -ForegroundColor Cyan

$totalSuccess = $routingSuccess + $apiSuccess
$totalTests = ($routingSuccess + $routingFailed) + ($apiSuccess + $apiFailed)

Write-Host "`n🎯 الإجمالي:" -ForegroundColor White
Write-Host "✅ نجح: $totalSuccess" -ForegroundColor Green
Write-Host "❌ فشل: $($totalTests - $totalSuccess)" -ForegroundColor Red
Write-Host "📈 نسبة النجاح الإجمالية: $([math]::Round(($totalSuccess / $totalTests) * 100))%" -ForegroundColor Cyan

Write-Host "`n💡 التوصيات:" -ForegroundColor White

if ($totalSuccess -eq $totalTests) {
    Write-Host "🎉 جميع الاختبارات نجحت! النظام جاهز للـ deployment." -ForegroundColor Green
}
elseif ($totalSuccess -ge ($totalTests * 0.8)) {
    Write-Host "✅ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة." -ForegroundColor Yellow
}
elseif ($totalSuccess -ge ($totalTests * 0.6)) {
    Write-Host "⚠️  النظام يعمل مع مشاكل متوسطة تحتاج مراجعة." -ForegroundColor Yellow
}
else {
    Write-Host "🚨 النظام يحتاج إصلاحات عاجلة قبل الـ deployment." -ForegroundColor Red
}

Write-Host "`n✅ انتهى الاختبار!" -ForegroundColor Green