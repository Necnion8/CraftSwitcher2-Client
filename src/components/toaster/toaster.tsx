import { Toaster } from 'sonner';

import { Iconify } from 'src/components/iconify';

export function SonnerToaster() {
  return (
    <Toaster
      icons={{
        success: <Iconify icon="eva:checkmark-circle-2-fill" />,
        info: <Iconify icon="eva:info-fill" />,
        warning: <Iconify icon="eva:alert-triangle-fill" />,
        error: <Iconify icon="eva:alert-circle-fill" />,
      }}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'toaster',
          icon: 'toaster__icon',
          success: 'toaster__success',
          info: 'toaster__info',
          warning: 'toaster__warning',
          error: 'toaster__error',
          description: 'toaster__description',
          closeButton: 'toaster__closeButton',
        },
      }}
      closeButton
      gap={12}
      offset={20}
      duration={5000}
    />
  );
}
