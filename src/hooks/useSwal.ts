import { useTranslation } from '../translations';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export function useSwal() {
  const { t } = useTranslation();

  function confirmation(message?: string, options?: SweetAlertOptions) {
    return Swal.fire({
      title: t('etesVousCertain'),
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('oui'),
      cancelButtonText: t('non'),
      reverseButtons: true,
      ...options,
    });
  }

  return {
    confirmation,
  };
}
