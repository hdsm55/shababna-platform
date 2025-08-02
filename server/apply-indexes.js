#!/usr/bin/env node

import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyIndexes() {
    try {
        console.log('🔧 بدء تطبيق Database Indexes...');

        // قراءة ملف SQL
        const sqlFile = path.join(__dirname, 'db', 'add-indexes.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // تقسيم SQL إلى أوامر منفصلة
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📊 تم العثور على ${statements.length} أمر SQL`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            if (statement.trim()) {
                try {
                    await query(statement);
                    console.log(`✅ تم تنفيذ الأمر ${i + 1}/${statements.length}`);
                    successCount++;
                } catch (error) {
                    console.log(`❌ خطأ في الأمر ${i + 1}/${statements.length}:`, error.message);
                    errorCount++;
                }
            }
        }

        console.log('\n📈 ملخص النتائج:');
        console.log(`✅ نجح: ${successCount}`);
        console.log(`❌ فشل: ${errorCount}`);
        console.log(`📊 إجمالي: ${statements.length}`);

        if (errorCount === 0) {
            console.log('🎉 تم تطبيق جميع Indexes بنجاح!');
        } else {
            console.log('⚠️ تم تطبيق معظم Indexes مع بعض الأخطاء');
        }

    } catch (error) {
        console.error('❌ خطأ في تطبيق Indexes:', error);
    }
}

// تشغيل السكريبت
applyIndexes();