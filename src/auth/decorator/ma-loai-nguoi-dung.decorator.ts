import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { AccountType } from '../enum/accountType.enum';

export function IsMaLoaiNguoiDung(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isMaLoaiNguoiDung',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && (value === AccountType.Normal || value === AccountType.Admin);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} chỉ có thể là 'Normal' hoặc 'Admin'.`;
        },
      },
    });
  };
}