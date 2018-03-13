/***
 * Like the java.util.Optional of Java8.
 *
 * For example.
 *
 * let value: string = Optional
 *      .of(objectA) //objectA may be null
 *      .map(a => a.fieldB) // a.fieldB may be null
 *      .map(b => b.fieldC) // b.fieldC may be null
 *      .map(c => c.fieldD) // c.fieldD may be null
 *      ... ...
 *      .map(y => y.fieldZ) // y.fieldZ may be null
 *      .orElse('defaultValue') // If the final result is null, return 'defaultValue'
 */
export class Optional<T> {

    value: T;

    private constructor(value: T) {
        this.value = value;
    }

    static of<T>(value: T): Optional<T> {
        return new Optional<T>(value);
    }

    map<V>(mapper: (T) => V): Optional<V> {
        if (this.value == null) {
            return Optional.of<V>(null);
        }
        return Optional.of(mapper(this.value));
    }

    orElse(defaultValue: T): T {
        return this.value != null ? this.value : defaultValue;
    }
}