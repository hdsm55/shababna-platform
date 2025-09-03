#!/usr/bin/env node

/**
 * محسن أداء الموقع
 * يقوم بتحليل وتحسين أداء الموقع تلقائياً
 */

import fs from 'fs';
import path from 'path';

class PerformanceOptimizer {
    constructor() {
        this.optimizations = [];
        this.reportPath = path.join(process.cwd(), 'optimization-report.json');
    }

    // بدء عملية التحسين
    async start() {
        console.log('🚀 بدء تحسين أداء الموقع...');

        try {
            // تحليل الأداء الحالي
            await this.analyzePerformance();

            // تطبيق التحسينات
            await this.applyOptimizations();

            // إنشاء التقرير
            this.generateReport();

            console.log('✅ تم الانتهاء من تحسين الأداء بنجاح');
        } catch (error) {
            console.error('❌ فشل في تحسين الأداء:', error.message);
        }
    }

    // تحليل الأداء الحالي
    async analyzePerformance() {
        console.log('📊 تحليل الأداء الحالي...');

        // فحص ملفات المشروع
        await this.analyzeProjectFiles();

        // فحص إعدادات Vite
        await this.analyzeViteConfig();

        // فحص إعدادات Tailwind
        await this.analyzeTailwindConfig();

        // فحص المكونات
        await this.analyzeComponents();

        console.log('✅ تم تحليل الأداء بنجاح');
    }

    // تحليل ملفات المشروع
    async analyzeProjectFiles() {
        console.log('  📁 فحص ملفات المشروع...');

        const projectRoot = process.cwd();
        const srcPath = path.join(projectRoot, 'src');

        // فحص حجم الملفات
        const fileSizes = await this.getFileSizes(srcPath);

        // تحديد الملفات الكبيرة
        const largeFiles = fileSizes.filter(file => file.size > 100 * 1024); // أكبر من 100KB

        if (largeFiles.length > 0) {
            this.optimizations.push({
                type: 'file-size',
                issue: 'ملفات كبيرة',
                files: largeFiles,
                recommendation: 'تقسيم الملفات الكبيرة، استخدام Lazy Loading',
                priority: 'متوسطة',
            });
        }

        // فحص المكونات
        const components = await this.findComponents(srcPath);

        // تحديد المكونات غير المستخدمة
        const unusedComponents = await this.findUnusedComponents(components);

        if (unusedComponents.length > 0) {
            this.optimizations.push({
                type: 'unused-components',
                issue: 'مكونات غير مستخدمة',
                components: unusedComponents,
                recommendation: 'إزالة المكونات غير المستخدمة',
                priority: 'منخفضة',
            });
        }
    }

    // تحليل إعدادات Vite
    async analyzeViteConfig() {
        console.log('  ⚙️ فحص إعدادات Vite...');

        const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');

        if (fs.existsSync(viteConfigPath)) {
            const config = fs.readFileSync(viteConfigPath, 'utf8');

            // فحص Bundle Splitting
            if (!config.includes('manualChunks')) {
                this.optimizations.push({
                    type: 'vite-config',
                    issue: 'عدم وجود Bundle Splitting',
                    recommendation: 'إضافة manualChunks لتقسيم الباندل',
                    priority: 'عالية',
                });
            }

            // فحص Minification
            if (!config.includes('terser')) {
                this.optimizations.push({
                    type: 'vite-config',
                    issue: 'عدم وجود Terser Minification',
                    recommendation: 'إضافة Terser لتصغير الكود',
                    priority: 'عالية',
                });
            }

            // فحص Source Maps
            if (config.includes('sourcemap: true')) {
                this.optimizations.push({
                    type: 'vite-config',
                    issue: 'Source Maps مفعلة للإنتاج',
                    recommendation: 'إيقاف Source Maps للإنتاج',
                    priority: 'متوسطة',
                });
            }
        }
    }

    // تحليل إعدادات Tailwind
    async analyzeTailwindConfig() {
        console.log('  🎨 فحص إعدادات Tailwind...');

        const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');

        if (fs.existsSync(tailwindConfigPath)) {
            const config = fs.readFileSync(tailwindConfigPath, 'utf8');

            // فحص Purge CSS
            if (!config.includes('purge') && !config.includes('content')) {
                this.optimizations.push({
                    type: 'tailwind-config',
                    issue: 'عدم وجود Purge CSS',
                    recommendation: 'إضافة content array لتنظيف CSS غير المستخدم',
                    priority: 'عالية',
                });
            }

            // فحص JIT Mode
            if (!config.includes('mode: "jit"')) {
                this.optimizations.push({
                    type: 'tailwind-config',
                    issue: 'عدم وجود JIT Mode',
                    recommendation: 'تفعيل JIT Mode لتحسين الأداء',
                    priority: 'متوسطة',
                });
            }
        }
    }

    // تحليل المكونات
    async analyzeComponents() {
        console.log('  🧩 فحص المكونات...');

        const componentsPath = path.join(process.cwd(), 'src/components');

        if (fs.existsSync(componentsPath)) {
            const components = await this.findComponents(componentsPath);

            // فحص استخدام React.memo
            const unmemoizedComponents = await this.findUnmemoizedComponents(components);

            if (unmemoizedComponents.length > 0) {
                this.optimizations.push({
                    type: 'component-optimization',
                    issue: 'مكونات بدون React.memo',
                    components: unmemoizedComponents,
                    recommendation: 'إضافة React.memo للمكونات التي لا تتغير كثيراً',
                    priority: 'متوسطة',
                });
            }

            // فحص استخدام useCallback و useMemo
            const unoptimizedHooks = await this.findUnoptimizedHooks(components);

            if (unoptimizedHooks.length > 0) {
                this.optimizations.push({
                    type: 'hook-optimization',
                    issue: 'عدم استخدام useCallback و useMemo',
                    components: unoptimizedHooks,
                    recommendation: 'استخدام useCallback و useMemo لتحسين الأداء',
                    priority: 'متوسطة',
                });
            }
        }
    }

    // تطبيق التحسينات
    async applyOptimizations() {
        console.log('🔧 تطبيق التحسينات...');

        for (const optimization of this.optimizations) {
            try {
                await this.applyOptimization(optimization);
            } catch (error) {
                console.warn(`⚠️ فشل في تطبيق التحسين: ${optimization.type}`, error.message);
            }
        }

        console.log('✅ تم تطبيق التحسينات بنجاح');
    }

    // تطبيق تحسين محدد
    async applyOptimization(optimization) {
        console.log(`  🔧 تطبيق: ${optimization.type}`);

        switch (optimization.type) {
            case 'vite-config':
                await this.optimizeViteConfig();
                break;
            case 'tailwind-config':
                await this.optimizeTailwindConfig();
                break;
            case 'component-optimization':
                await this.optimizeComponents();
                break;
            default:
                console.log(`    ℹ️ لا يوجد تطبيق تلقائي لهذا النوع: ${optimization.type}`);
        }
    }

    // تحسين إعدادات Vite
    async optimizeViteConfig() {
        const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');

        if (fs.existsSync(viteConfigPath)) {
            let config = fs.readFileSync(viteConfigPath, 'utf8');

            // إضافة Bundle Splitting إذا لم يكن موجوداً
            if (!config.includes('manualChunks')) {
                const manualChunks = `
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
        ui: ['framer-motion', 'lucide-react'],
        state: ['@tanstack/react-query', 'zustand'],
        i18n: ['react-i18next', 'i18next'],
      },
    },
  },`;

                config = config.replace(/build:\s*{/, `build: {${manualChunks}`);
            }

            // إضافة Terser إذا لم يكن موجوداً
            if (!config.includes('terser')) {
                const terserConfig = `
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },`;

                config = config.replace(/build:\s*{/, `build: {${terserConfig}`);
            }

            // إيقاف Source Maps للإنتاج
            config = config.replace(/sourcemap:\s*true/g, 'sourcemap: false');

            fs.writeFileSync(viteConfigPath, config);
            console.log('    ✅ تم تحديث إعدادات Vite');
        }
    }

    // تحسين إعدادات Tailwind
    async optimizeTailwindConfig() {
        const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');

        if (fs.existsSync(tailwindConfigPath)) {
            let config = fs.readFileSync(tailwindConfigPath, 'utf8');

            // إضافة content array إذا لم يكن موجوداً
            if (!config.includes('content')) {
                const contentConfig = `
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],`;

                config = config.replace(/module\.exports\s*=\s*{/, `module.exports = {${contentConfig}`);
            }

            // إضافة JIT Mode
            if (!config.includes('mode: "jit"')) {
                const jitConfig = `
  mode: "jit",`;

                config = config.replace(/module\.exports\s*=\s*{/, `module.exports = {${jitConfig}`);
            }

            fs.writeFileSync(tailwindConfigPath, config);
            console.log('    ✅ تم تحديث إعدادات Tailwind');
        }
    }

    // تحسين المكونات
    async optimizeComponents() {
        console.log('    ℹ️ تحسين المكونات يتطلب مراجعة يدوية');
        console.log('    💡 استخدم React.memo و useCallback و useMemo');
    }

    // الحصول على أحجام الملفات
    async getFileSizes(dirPath) {
        const files = [];

        const readDir = async (currentPath) => {
            const items = fs.readdirSync(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    await readDir(fullPath);
                } else if (stat.isFile()) {
                    files.push({
                        path: fullPath.replace(process.cwd(), ''),
                        size: stat.size,
                        name: item,
                    });
                }
            }
        };

        await readDir(dirPath);
        return files;
    }

    // البحث عن المكونات
    async findComponents(dirPath) {
        const components = [];

        const readDir = async (currentPath) => {
            const items = fs.readdirSync(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    await readDir(fullPath);
                } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.jsx'))) {
                    components.push({
                        path: fullPath,
                        name: item,
                        content: fs.readFileSync(fullPath, 'utf8'),
                    });
                }
            }
        };

        await readDir(dirPath);
        return components;
    }

    // البحث عن المكونات غير المستخدمة
    async findUnusedComponents(components) {
        // هذا يتطلب تحليل أكثر تعقيداً
        // يمكن إضافة منطق للبحث عن الاستيرادات
        return [];
    }

    // البحث عن المكونات بدون React.memo
    async findUnmemoizedComponents(components) {
        return components.filter(comp =>
            comp.content.includes('export default') &&
            !comp.content.includes('React.memo') &&
            !comp.content.includes('memo(')
        );
    }

    // البحث عن Hooks غير محسنة
    async findUnoptimizedHooks(components) {
        return components.filter(comp =>
            comp.content.includes('useEffect') &&
            !comp.content.includes('useCallback') &&
            !comp.content.includes('useMemo')
        );
    }

    // إنشاء تقرير التحسين
    generateReport() {
        console.log('\n📋 إنشاء تقرير التحسين...');

        const report = {
            timestamp: new Date().toISOString(),
            optimizations: this.optimizations,
            summary: this.generateSummary(),
            nextSteps: this.generateNextSteps(),
        };

        // حفظ التقرير
        try {
            fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
            console.log(`✅ تم حفظ التقرير في: ${this.reportPath}`);
        } catch (error) {
            console.error('❌ فشل في حفظ التقرير:', error.message);
        }

        // عرض التقرير
        this.displayReport(report);

        return report;
    }

    // إنشاء ملخص التحسين
    generateSummary() {
        const summary = {
            total: this.optimizations.length,
            byPriority: {
                high: this.optimizations.filter(o => o.priority === 'عالية').length,
                medium: this.optimizations.filter(o => o.priority === 'متوسطة').length,
                low: this.optimizations.filter(o => o.priority === 'منخفضة').length,
            },
            byType: {},
        };

        this.optimizations.forEach(opt => {
            summary.byType[opt.type] = (summary.byType[opt.type] || 0) + 1;
        });

        return summary;
    }

    // إنشاء الخطوات التالية
    generateNextSteps() {
        const nextSteps = [];

        if (this.optimizations.some(o => o.priority === 'عالية')) {
            nextSteps.push('تطبيق التحسينات عالية الأولوية أولاً');
        }

        if (this.optimizations.some(o => o.type === 'vite-config')) {
            nextSteps.push('إعادة بناء المشروع بعد تحديث إعدادات Vite');
        }

        if (this.optimizations.some(o => o.type === 'tailwind-config')) {
            nextSteps.push('إعادة بناء CSS بعد تحديث إعدادات Tailwind');
        }

        nextSteps.push('اختبار الأداء بعد تطبيق التحسينات');
        nextSteps.push('مراقبة Core Web Vitals');

        return nextSteps;
    }

    // عرض التقرير
    displayReport(report) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 تقرير تحسين الأداء');
        console.log('='.repeat(60));

        console.log(`\n📅 التاريخ: ${new Date(report.timestamp).toLocaleString('ar-SA')}`);

        console.log('\n📈 ملخص التحسينات:');
        console.log(`  - إجمالي التحسينات: ${report.summary.total}`);
        console.log(`  - عالية الأولوية: ${report.summary.byPriority.high}`);
        console.log(`  - متوسطة الأولوية: ${report.summary.byPriority.medium}`);
        console.log(`  - منخفضة الأولوية: ${report.summary.byPriority.low}`);

        if (report.optimizations.length > 0) {
            console.log('\n🔧 التحسينات المقترحة:');
            report.optimizations.forEach((opt, index) => {
                console.log(`  ${index + 1}. ${opt.type}: ${opt.issue}`);
                console.log(`     التوصية: ${opt.recommendation}`);
                console.log(`     الأولوية: ${opt.priority}`);
                console.log('');
            });
        } else {
            console.log('\n✅ لا توجد تحسينات مطلوبة - الأداء ممتاز!');
        }

        if (report.nextSteps.length > 0) {
            console.log('\n🚀 الخطوات التالية:');
            report.nextSteps.forEach((step, index) => {
                console.log(`  ${index + 1}. ${step}`);
            });
        }

        console.log('='.repeat(60));
    }
}

// تشغيل المحسن
const optimizer = new PerformanceOptimizer();

// بدء عملية التحسين
optimizer.start().catch(console.error);

export default PerformanceOptimizer;
