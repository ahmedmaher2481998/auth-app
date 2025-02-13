import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const user = ctx.getRequest().user;
    console.log('user', user);
    return user['sub'];
  },
);