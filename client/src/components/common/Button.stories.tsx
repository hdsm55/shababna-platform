import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Heart, Mail } from 'lucide-react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون زر قابل للوصول مع دعم متعدد اللغات والحركات',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'icon', 'outline'],
      description: 'نوع الزر',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'حجم الزر',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'حالة التعطيل',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'حالة التحميل',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'عرض كامل',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Button
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'زر أساسي',
    size: 'md',
  },
};

// Secondary Button
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'زر ثانوي',
    size: 'md',
  },
};

// Ghost Button
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'زر شفاف',
    size: 'md',
  },
};

// Outline Button
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'زر إطار',
    size: 'md',
  },
};

// Icon Button
export const Icon: Story = {
  args: {
    variant: 'icon',
    children: 'زر أيقونة',
    icon: Heart,
    size: 'md',
  },
};

// Button with Icon
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'زر مع أيقونة',
    icon: ArrowRight,
    iconPosition: 'right',
    size: 'md',
  },
};

// Loading Button
export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'زر محمل',
    loading: true,
    size: 'md',
  },
};

// Disabled Button
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'زر معطل',
    disabled: true,
    size: 'md',
  },
};

// Full Width Button
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'زر بعرض كامل',
    fullWidth: true,
    size: 'md',
  },
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button variant="primary" size="sm">
        صغير
      </Button>
      <Button variant="primary" size="md">
        متوسط
      </Button>
      <Button variant="primary" size="lg">
        كبير
      </Button>
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">أساسي</Button>
      <Button variant="secondary">ثانوي</Button>
      <Button variant="ghost">شفاف</Button>
      <Button variant="outline">إطار</Button>
      <Button variant="icon" icon={Heart}>
        أيقونة
      </Button>
    </div>
  ),
};

// Accessibility Test
export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4">
      <Button
        variant="primary"
        aria-label="زر إرسال البريد الإلكتروني"
        aria-describedby="email-button-description"
      >
        <Mail className="w-4 h-4 mr-2" />
        إرسال بريد
      </Button>
      <p id="email-button-description" className="text-sm text-gray-600">
        يرسل بريد إلكتروني إلى المستخدم المحدد
      </p>
    </div>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
