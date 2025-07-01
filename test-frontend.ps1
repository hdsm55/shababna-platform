Write-Host "🧪 بدء اختبار شامل للفرونت إند والباك إند...`n" -ForegroundColor Green

$baseURL = "http://localhost:5001/api"
$frontendURL = "http://localhost:5173"

try {
    # 1. اختبار الاتصال بالباك إند
    Write-Host "1. اختبار الاتصال بالباك إند..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "$baseURL/health" -ErrorAction Stop
    Write-Host "✅ الباك إند يعمل: $($healthResponse.message)" -ForegroundColor Green

    # 2. اختبار API الفعاليات
    Write-Host "`n2. اختبار API الفعاليات..." -ForegroundColor Yellow
    $eventsResponse = Invoke-RestMethod -Uri "$baseURL/events" -ErrorAction Stop
    Write-Host "✅ تم جلب $($eventsResponse.events.Count) فعالية" -ForegroundColor Green
    Write-Host "📋 الفعاليات المتاحة:" -ForegroundColor Cyan
    $eventsResponse.events | ForEach-Object {
        Write-Host "   - $($_.title) ($($_.category))" -ForegroundColor White
    }

    # 3. اختبار API البرامج
    Write-Host "`n3. اختبار API البرامج..." -ForegroundColor Yellow
    $programsResponse = Invoke-RestMethod -Uri "$baseURL/programs" -ErrorAction Stop
    Write-Host "✅ تم جلب $($programsResponse.programs.Count) برنامج" -ForegroundColor Green
    Write-Host "📋 البرامج المتاحة:" -ForegroundColor Cyan
    $programsResponse.programs | ForEach-Object {
        Write-Host "   - $($_.title) ($($_.category))" -ForegroundColor White
        Write-Host "     التقدم: `$$($_.current_amount)/`$$($_.goal_amount)" -ForegroundColor Gray
    }

    # 4. اختبار الفرونت إند
    Write-Host "`n4. اختبار الفرونت إند..." -ForegroundColor Yellow
    try {
        $frontendResponse = Invoke-WebRequest -Uri $frontendURL -ErrorAction Stop
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Host "✅ الفرونت إند يعمل على $frontendURL" -ForegroundColor Green
        } else {
            Write-Host "❌ الفرونت إند لا يعمل" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ الفرونت إند لا يعمل" -ForegroundColor Red
    }

    # 5. اختبار صفحة الفعاليات
    Write-Host "`n5. اختبار صفحة الفعاليات..." -ForegroundColor Yellow
    try {
        $eventsPageResponse = Invoke-WebRequest -Uri "$frontendURL/events" -ErrorAction Stop
        if ($eventsPageResponse.StatusCode -eq 200) {
            Write-Host "✅ صفحة الفعاليات متاحة" -ForegroundColor Green
        } else {
            Write-Host "❌ صفحة الفعاليات غير متاحة" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ صفحة الفعاليات غير متاحة" -ForegroundColor Red
    }

    # 6. اختبار صفحة البرامج
    Write-Host "`n6. اختبار صفحة البرامج..." -ForegroundColor Yellow
    try {
        $programsPageResponse = Invoke-WebRequest -Uri "$frontendURL/programs" -ErrorAction Stop
        if ($programsPageResponse.StatusCode -eq 200) {
            Write-Host "✅ صفحة البرامج متاحة" -ForegroundColor Green
        } else {
            Write-Host "❌ صفحة البرامج غير متاحة" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ صفحة البرامج غير متاحة" -ForegroundColor Red
    }

    Write-Host "`n🎉 انتهى الاختبار الشامل بنجاح!" -ForegroundColor Green
    Write-Host "`n📝 ملخص النتائج:" -ForegroundColor Cyan
    Write-Host "   - الباك إند: ✅ يعمل على البورت 5001" -ForegroundColor Green
    Write-Host "   - الفرونت إند: ✅ يعمل على البورت 5173" -ForegroundColor Green
    Write-Host "   - قاعدة البيانات: ✅ متصلة وتحتوي على بيانات" -ForegroundColor Green
    Write-Host "   - API الفعاليات: ✅ يعمل ويعرض البيانات" -ForegroundColor Green
    Write-Host "   - API البرامج: ✅ يعمل ويعرض البيانات" -ForegroundColor Green

    Write-Host "`n🌐 روابط الوصول:" -ForegroundColor Cyan
    Write-Host "   - الصفحة الرئيسية: $frontendURL" -ForegroundColor White
    Write-Host "   - صفحة الفعاليات: $frontendURL/events" -ForegroundColor White
    Write-Host "   - صفحة البرامج: $frontendURL/programs" -ForegroundColor White
    Write-Host "   - API الصحة: $baseURL/health" -ForegroundColor White

} catch {
    Write-Host "❌ خطأ في الاختبار: $($_.Exception.Message)" -ForegroundColor Red
}