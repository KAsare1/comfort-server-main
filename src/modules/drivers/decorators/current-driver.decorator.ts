// src/drivers/decorators/current-driver.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentDriver = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // This is set by the JWT strategy
  },
);