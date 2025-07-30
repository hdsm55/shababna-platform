import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// قائمة بالاستيرادات التي يجب إزالتها
const unusedImports = [
    'AnimatePresence',
    'Plus',
    'Shield',
    'MoreHorizontal',
    'CheckCircle',
    'XCircle',
    'Star',
    'Activity',
    'TrendingUp',
    'Upload',
    'Settings',
    'Crown',
    'Award',
    'Heart',
    'MessageCircle',
    'Bell',
    'Lock',
    'Unlock',
    'Key',
    'EyeOff',
    'AlertTriangle',
    'Info',
    'HelpCircle',
    'ExternalLink',
    'Copy',
    'Share2',
    'Archive',
    'Send',
    'MailIcon',
    'PhoneIcon',
    'Smartphone',
    'Monitor',
    'Tablet',
    'Laptop',
    'Database',
    'Server',
    'Cloud',
    'Wifi',
    'Signal',
    'Battery',
    'Volume2',
    'VolumeX',
    'Mic',
    'MicOff',
    'Camera',
    'CameraOff',
    'Video',
    'VideoOff',
    'Headphones',
    'Speaker',
    'Radio',
    'Tv',
    'Mobile',
    'Watch',
    'TimeIcon',
    'DateIcon',
    'Timer',
    'TimerOff',
    'Hourglass',
    'History',
    'Repeat',
    'RotateCcw',
    'RotateCw',
    'FastForward',
    'Rewind',
    'SkipBack',
    'SkipForward',
    'PlayCircle',
    'PauseCircle',
    'StopIcon',
    'SquareIcon',
    'Circle',
    'Dot',
    'MinusIcon',
    'PlusIcon',
    'Check',
    'AlertTriangleIcon',
    'InfoIcon',
    'HelpCircleIcon',
    'LockIcon',
    'UnlockIcon',
    'EyeIcon',
    'EyeOffIcon',
    'KeyIcon',
    'Fingerprint',
    'ShieldIcon',
    'ShieldCheck',
    'ShieldX',
    'ShieldAlert',
    'ShieldOff',
    'UserCheckIcon',
    'UserXIcon',
    'UserAdd',
    'UserMinus',
    'UsersIcon',
    'UserCog',
    'UserSearch',
    'UserVerified',
    'UserBlocked',
    'Link',
    'isRTL',
    'setSortOrder',
    'image',
    'formatLastLogin',
    'index'
]

function cleanImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        let newContent = content

        // إزالة الاستيرادات غير المستخدمة
        unusedImports.forEach(importName => {
            const regex = new RegExp(`\\b${importName}\\b`, 'g')
            newContent = newContent.replace(regex, '')
        })

        // تنظيف الفواصل الزائدة
        newContent = newContent.replace(/,\s*,/g, ',')
        newContent = newContent.replace(/,\s*}/g, '}')
        newContent = newContent.replace(/{\s*,/g, '{')

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent)
            console.log(`✅ تم تنظيف ${filePath}`)
        }
    } catch (error) {
        console.error(`❌ خطأ في تنظيف ${filePath}:`, error.message)
    }
}

// تنظيف الملفات الرئيسية
const filesToClean = [
    '../src/pages/dashboard/Users.tsx',
    '../src/pages/dashboard/Programs.tsx',
    '../src/pages/dashboard/Registrants.tsx',
    '../src/pages/dashboard/Reports.tsx',
    '../src/pages/dashboard/Settings.tsx'
]

filesToClean.forEach(file => {
    const filePath = path.join(__dirname, file)
    if (fs.existsSync(filePath)) {
        cleanImports(filePath)
    }
})

console.log('🎉 تم الانتهاء من تنظيف الاستيرادات!')