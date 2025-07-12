import React from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';

interface DonationFormProps {
  open: boolean;
  type: 'add' | 'edit' | 'view';
  form: any;
  formError: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({
  open,
  type,
  form,
  formError,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        type === 'add'
          ? 'إضافة تبرع'
          : type === 'edit'
          ? 'تعديل تبرع'
          : 'عرض تبرع'
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="اسم المتبرع"
          name="donorName"
          value={form.donorName}
          onChange={onChange}
          required
        />
        <Input
          label="البريد الإلكتروني"
          name="donorEmail"
          value={form.donorEmail}
          onChange={onChange}
          required
        />
        <Input
          label="المبلغ"
          name="amount"
          type="number"
          value={form.amount}
          onChange={onChange}
          required
        />
        <Input
          label="العملة"
          name="currency"
          value={form.currency}
          onChange={onChange}
        />
        <Input
          label="طريقة الدفع"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={onChange}
        />
        <Input
          label="الفئة"
          name="category"
          value={form.category}
          onChange={onChange}
        />
        <Input
          label="الوصف"
          name="description"
          value={form.description}
          onChange={onChange}
        />
        <Input
          label="ملاحظات"
          name="notes"
          value={form.notes}
          onChange={onChange}
        />
        <Input
          label="الموقع"
          name="location"
          value={form.location}
          onChange={onChange}
        />
        <Input
          label="الحملة"
          name="campaign"
          value={form.campaign}
          onChange={onChange}
        />
        {formError && <Alert type="error">{formError}</Alert>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          {type !== 'view' && (
            <Button type="submit" variant="primary">
              {type === 'add' ? 'إضافة' : 'تحديث'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DonationForm;
