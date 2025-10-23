import { toast } from 'sonner';
import { useTranslation } from '../translations';

export function useToast() {
  const { t } = useTranslation();

  function success(message?: string) {
    return toast.success(t('operationReussie'), {
      description: message,
      duration: 5000,
    });
  }

  function warning(message: string, titre?: string) {
    return toast.warning(titre ?? t('attention'), {
      description: message,
      duration: 5000,
    });
  }

  function error(message: string) {
    return toast.error(t('erreur'), {
      description: message,
      duration: 5000,
    });
  }

  return {
    warning,
    success,
    error,
  };
}
