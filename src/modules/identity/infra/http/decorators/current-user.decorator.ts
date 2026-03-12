import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ValidatedUser {
  id: string; // The User ID
  email: string; // The User Email
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ValidatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
