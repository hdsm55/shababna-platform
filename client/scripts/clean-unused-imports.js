import fs from 'fs';
import path from 'path';

// قائمة الأيقونات المستخدمة فعلياً
const usedIcons = [
    'ArrowRight', 'Sparkles', 'Calendar', 'Users', 'Clock', 'Heart', 'MapPin',
    'CheckCircle', 'UserPlus', 'Plus', 'Edit', 'Trash2', 'Eye', 'Search', 'Filter',
    'Download', 'Upload', 'Settings', 'Bell', 'Mail', 'Phone', 'Globe', 'Star',
    'Award', 'Target', 'MessageCircle', 'Lock', 'Unlock', 'Key', 'EyeOff',
    'AlertTriangle', 'Info', 'HelpCircle', 'ExternalLink', 'Copy', 'Share2',
    'Archive', 'Send', 'Smartphone', 'Monitor', 'Tablet', 'Laptop', 'Database',
    'Server', 'Cloud', 'Wifi', 'Signal', 'Battery', 'Volume2', 'VolumeX', 'Mic',
    'MicOff', 'Camera', 'CameraOff', 'Video', 'VideoOff', 'Headphones', 'Speaker',
    'Radio', 'Tv', 'Watch', 'Timer', 'TimerOff', 'Hourglass', 'History', 'Repeat',
    'RotateCcw', 'RotateCw', 'FastForward', 'Rewind', 'SkipBack', 'SkipForward',
    'PlayCircle', 'PauseCircle', 'StopCircle', 'CheckSquare', 'Square', 'Circle',
    'Dot', 'Check', 'Fingerprint', 'Shield', 'ShieldCheck', 'ShieldX', 'ShieldAlert',
    'ShieldOff', 'User', 'UserCheck', 'UserX', 'UserAdd', 'UserMinus', 'UserCog',
    'UserVerified', 'UserBlocked', 'Link', 'Crown', 'Activity', 'TrendingUp',
    'TrendingDown', 'BarChart', 'PieChart', 'LineChart', 'Zap', 'Rocket',
    'Lightbulb', 'Trophy', 'Medal', 'Flag', 'BookOpen', 'GraduationCap',
    'Briefcase', 'Coffee', 'Smile', 'ThumbsUp', 'RefreshCw', 'Palette'
];

function cleanUnusedImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const newLines = [];
        let inImportBlock = false;
        let importLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // بداية كتلة الاستيراد
            if (line.trim().startsWith('import') && line.includes('from')) {
                inImportBlock = true;
                importLines.push(line);
                continue;
            }

            // إذا كنا في كتلة الاستيراد ونصادف سطر فارغ أو تعليق
            if (inImportBlock && (line.trim() === '' || line.trim().startsWith('//'))) {
                importLines.push(line);
                continue;
            }

            // نهاية كتلة الاستيراد
            if (inImportBlock && line.trim() !== '' && !line.trim().startsWith('//')) {
                inImportBlock = false;

                // تنظيف الاستيرادات
                const cleanedImports = cleanImportBlock(importLines);
                newLines.push(...cleanedImports);
                importLines = [];
            }

            if (!inImportBlock) {
                newLines.push(line);
            }
        }

        // إضافة أي استيرادات متبقية
        if (importLines.length > 0) {
            const cleanedImports = cleanImportBlock(importLines);
            newLines.push(...cleanedImports);
        }

        fs.writeFileSync(filePath, newLines.join('\n'));
        console.log(`✅ تم تنظيف: ${filePath}`);
    } catch (error) {
        console.error(`❌ خطأ في تنظيف ${filePath}:`, error.message);
    }
}

function cleanImportBlock(importLines) {
    const cleanedLines = [];

    for (const line of importLines) {
        if (line.trim() === '' || line.trim().startsWith('//')) {
            cleanedLines.push(line);
            continue;
        }

        // استيراد من lucide-react
        if (line.includes('lucide-react')) {
            const match = line.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
            if (match) {
                const icons = match[1].split(',').map(icon => icon.trim());
                const usedIconsInLine = icons.filter(icon => usedIcons.includes(icon));

                if (usedIconsInLine.length > 0) {
                    const newImport = `import { ${usedIconsInLine.join(', ')} } from 'lucide-react';`;
                    cleanedLines.push(newImport);
                }
            } else {
                cleanedLines.push(line);
            }
        } else {
            cleanedLines.push(line);
        }
    }

    return cleanedLines;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            cleanUnusedImports(filePath);
        }
    }
}

// بدء التنظيف
console.log('🧹 بدء تنظيف الاستيرادات غير المستخدمة...');
processDirectory('./src');
console.log('✅ تم الانتهاء من تنظيف الاستيرادات!');
