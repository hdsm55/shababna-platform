import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportCard from '../ReportCard';

describe('ReportCard', () => {
  const mockReport = {
    id: '1',
    title: 'تقرير الأداء الشهري',
    author: 'أحمد محمد',
    status: 'published',
    format: 'pdf',
    description: 'وصف مختصر للتقرير',
    tags: ['أداء', 'شهري'],
    views: 10,
    downloads: 5,
    shares: 2,
    createdDate: '2024-06-01T10:30:00Z',
    isPublic: true,
    isFeatured: false,
  };

  it('يعرض عنوان التقرير والمؤلف بشكل صحيح', () => {
    render(
      <ReportCard report={mockReport} onEdit={jest.fn()} onView={jest.fn()} />
    );
    expect(screen.getByText('تقرير الأداء الشهري')).toBeInTheDocument();
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
  });

  it('يعرض زر عرض وزر تعديل', () => {
    render(
      <ReportCard report={mockReport} onEdit={jest.fn()} onView={jest.fn()} />
    );
    expect(screen.getByText('عرض')).toBeInTheDocument();
    expect(screen.getByText('تعديل')).toBeInTheDocument();
  });

  it('ينفذ onView عند الضغط على زر عرض', () => {
    const onView = jest.fn();
    render(
      <ReportCard report={mockReport} onEdit={jest.fn()} onView={onView} />
    );
    fireEvent.click(screen.getByText('عرض'));
    expect(onView).toHaveBeenCalled();
  });

  it('ينفذ onEdit عند الضغط على زر تعديل', () => {
    const onEdit = jest.fn();
    render(
      <ReportCard report={mockReport} onEdit={onEdit} onView={jest.fn()} />
    );
    fireEvent.click(screen.getByText('تعديل'));
    expect(onEdit).toHaveBeenCalled();
  });
});
