import { of } from 'rxjs';

export class MockWidgetListService {
  public widgets$ = of([]);
  public load = (): void => undefined;
}
