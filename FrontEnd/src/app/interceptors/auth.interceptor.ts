import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    withCredentials: true // Fondamentale per le sessioni PHP!
  });
  return next(clonedReq);
};