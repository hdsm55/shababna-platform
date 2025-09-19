import { useEffect, useMemo, useState } from 'react';
import { http } from '../services/api';

export interface SiteStats {
  users: number;
  programs: number;
  events: number;
  countries: number;
}

const arabAndIslamicCountries = [
  'السعودية','الإمارات','قطر','البحرين','الكويت','عُمان','اليمن','الأردن','سوريا','لبنان','العراق','فلسطين','مصر','ليبيا','تونس','الجزائر','المغرب','موريتانيا','السودان','جيبوتي','الصومال','جزر القمر','تركيا','إيران','باكستان','أفغانستان','إندونيسيا','ماليزيا','بروناي','بنغلاديش','الهند (مسلمون)','سريلانكا (مسلمون)','أذربيجان','كازاخستان','قرغيزستان','أوزبكستان','تركمانستان','طاجيكستان','النيجر','نيجيريا','السنغال','مالي','غامبيا','غينيا','تشاد','الكاميرون','ساحل العاج','سيراليون'
];

export function useSiteStats() {
  const [data, setData] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const countriesCount = arabAndIslamicCountries.length;

  useEffect(() => {
    let mounted = true;
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await http.get('/stats');
        const counts = res?.data?.data || { users: 0, programs: 0, events: 0 };
        if (mounted) {
          setData({
            users: Number(counts.users) || 0,
            programs: Number(counts.programs) || 0,
            events: Number(counts.events) || 0,
            countries: countriesCount,
          });
        }
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || 'Error');
          // عرض أصفار كافتراضي حتى مع الخطأ
          setData({ users: 0, programs: 0, events: 0, countries: countriesCount });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchStats();
    return () => {
      mounted = false;
    };
  }, [countriesCount]);

  const anyZero = useMemo(() => {
    if (!data) return false;
    return data.users === 0 || data.programs === 0 || data.events === 0;
  }, [data]);

  return { data, loading, error, countriesList: arabAndIslamicCountries, countriesCount, anyZero };
}


