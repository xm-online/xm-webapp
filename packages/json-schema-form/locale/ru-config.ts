export const RU_INTL = {
    required: 'Это поле обязательно к заполнению.',
    minLength: 'Должно быть не менее {{minimumLength}} символов (текущая длина: {{currentLength}}).',
    maxLength: 'Должно быть не более {{maximumLength}} символов (текущая длина: {{currentLength}}).',
    pattern: 'Должен соответствовать шаблону: {{requiredPattern}}.',
    format: (error: { requiredFormat: string }): string => {
        switch (error.requiredFormat) {
            case 'date':
                return 'Должна быть дата, например "2000-12-31".';
            case 'time':
                return 'Должно быть время, например "16:20" или "03:14:15.9265".';
            case 'date-time':
                return 'Укажите дату и время, например "2000-03-14T01:59" или "2000-03-14T01:59:26.535Z".';
            case 'email':
                return 'Должен быть адрес электронной почты, например "name@example.com".';
            case 'hostname':
                return 'Должно быть имя хоста, например "example.com".';
            case 'ipv4':
                return 'Должен быть IPv4-адрес, например "127.0.0.1".';
            case 'ipv6':
                return 'Должен быть IPv6-адрес, например "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0".';
            case 'url':
                return 'Это должен быть URL, например "http://www.example.com/page.html".';
            case 'uuid':
                return 'Должен быть uuid, например "12345678-9ABC-DEF0-1234-56789ABCDEF0".';
            case 'color':
                return 'Должен быть цвет, например "#FFFFFF" или "rgb(255, 255, 255)".';
            case 'json-pointer':
                return 'Должен быть указатель JSON, например "/pointer/to/something".';
            case 'relative-json-pointer':
                return 'Должен быть относительным указателем JSON, например "2/pointer/to/something".';
            case 'regex':
                return 'Должно быть регулярное выражение, например "(1-)?\\d{3}-\\d{3}-\\d{4}".';
            default:
                return `Должен быть правильно отформатирован ${error.requiredFormat}.`;
        }
    },
    minimum: 'Должно быть {{minimumValue}} или больше.',
    exclusiveMinimum: 'Должно быть больше {{exclusiveMinimumValue}}.',
    maximum: 'Должно быть {{maximumValue}} или меньше.',
    exclusiveMaximum: 'Должно быть меньше чем {{exclusiveMaximumValue}}.',
    multipleOf: (error: { multipleOfValue: number }): string => {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Должно быть ${decimals} или меньше десятичных знаков.`;
        }
        return `Должно быть кратно ${error.multipleOfValue}.`;

    },
    minProperties: 'Должно быть {{minimumProperties}} или более элементов (текущие элементы: {{currentProperties}}).',
    maxProperties: 'Должно быть {{maximumProperties}} или меньше элементов (текущие элементы: {{currentProperties}}).',
    minItems: 'Должно быть {{minimumItems}} или более элементов (текущие элементы: {{currentItems}}).',
    maxItems: 'Должно быть {{maximumItems}} или меньше элементов (текущие элементы: {{currentItems}}).',
    uniqueItems: 'Все элементы должны быть уникальными.',
};
