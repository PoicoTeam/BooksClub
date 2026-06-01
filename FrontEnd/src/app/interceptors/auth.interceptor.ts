import { HttpInterceptorFn } from '@angular/common/http';

/*
  INTERCEPTOR HTTP (authInterceptor)
  Aggiunge withCredentials: true a ogni richiesta verso il backend PHP
  così il browser invia il cookie PHPSESSID (sessione lato server).
*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    withCredentials: true,
  });
  return next(clonedReq);
};
