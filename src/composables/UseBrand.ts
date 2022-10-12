import { setCssVar } from 'quasar';
export default function useBrand() {
  const setBrand = (primary: string, secondary: string) => {
    if (primary) {
      setCssVar('primary', primary);
    }

    if (secondary) {
      setCssVar('secondary', secondary);
    }
  };

  return {
    setBrand,
  };
}
