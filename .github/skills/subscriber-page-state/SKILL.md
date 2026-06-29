---
name: Subscriber Page State — Service and UI Switching via ?state Query Param
description: >
  The subscriber page is a container of independent widgets. Each widget may
  load different data or show/hide UI elements based on the `?state` query
  parameter in the URL. Use SubscriberPageStateService and the PAGE_STATE token
  to read state once reactively — never read ActivatedRoute or Router directly
  inside widgets or functional services.
---

# Subscriber Page State — Service and UI Switching via `?state`

## Context

The subscriber page is a **container of independent widgets**. Widgets are
loaded dynamically and do not share a parent component. The URL query parameter
`?state` controls two concerns across all widgets:

1. **Data loading** — which backend service/endpoint to call (`active` vs `archived`)
2. **UI visibility** — show or hide elements depending on the current state

---

## State contract

| `?state` value | Meaning |
|----------------|---------|
| `active`       | Subscriber is active — load active services, show active-only UI |
| `archived`     | Subscriber is archived — load archived services, hide action buttons |
| absent         | Call `product/api/product` with `msisdn` + `productId` from URL, read `status` from response, write back to `?state` |

---

## Key files

| File | Purpose |
|------|---------|
| `src/app/ext/crm-webapp-ext/module/core/subscriber-page-state.service.ts` | `SubscriberPageStateService` + `PAGE_STATE` token — **single source of truth, do not duplicate** |

---

## Rules

1. **Never inject `ActivatedRoute` or `Router` inside widgets or functional services** to read `?state`. Always use `inject(PAGE_STATE)`.

2. **In functional services**, read the signal **inside the returned lambda**, not at factory time:
   ```ts
   // correct
   const state = inject(PAGE_STATE);
   return (params) => state() === 'active' ? beActiveService()(params) : beArchivedService()(params);

   // wrong — captured once, never reacts to navigation
   const currentState = inject(PAGE_STATE)();
   return (params) => currentState === 'active' ? ...
   ```

3. **In components**, guard against `null` — state is `null` while being resolved from the API:
   ```html
   <ng-container *ngIf="state() !== null">
     <button *ngIf="state() === 'active'">Activate</button>
   </ng-container>
   ```

4. **Do not add state-switching logic to individual services.** The widget's component or its load trigger is responsible for calling the right service based on `state()`.

---

## Implementation

### SubscriberPageStateService and PAGE_STATE token

Create once in `src/app/ext/crm-webapp-ext/module/core/subscriber-page-state.service.ts`.
Do not recreate in widgets or services.

**Logic:**
- If `?state` is present → use it directly (`active` | `archived`)
- If `?state` is absent → call `product/api/product` with `msisdn` and `id` (productId) from URL query params → read `status` from `response[0]` → write it back to `?state` via `Router.navigate`

```ts
import { Injectable, InjectionToken, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map, startWith, take } from 'rxjs';

export type SubscriberPageState = 'active' | 'archived';

interface ProductRes {
    status?: string;
    id?: string;
}

@Injectable({ providedIn: 'root' })
export class SubscriberPageStateService {
    private readonly router = inject(Router);
    private readonly httpClient = inject(HttpClient);

    public readonly state: Signal<SubscriberPageState | null> = toSignal(
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            startWith(null),
            map(() => {
                const params = this.router.routerState.snapshot.root.queryParams;
                const state = params['state'];

                if (state === 'active' || state === 'archived') {
                    return state as SubscriberPageState;
                }

                // ?state absent — resolve from product endpoint
                const msisdn = params['msisdn'];
                const productId = params['productId'];

                if (msisdn || productId) {
                    this.resolveStateFromApi(msisdn, productId);
                }

                return null; // resolved asynchronously, widgets must guard against null
            }),
        ),
        { initialValue: null },
    );

    private resolveStateFromApi(msisdn: string, productId: string): void {
        this.httpClient
            .get<ProductRes[]>('product/api/product', {
                params: {
                    ...(msisdn && { msisdn }),
                    ...(productId && { id: productId }),
                },
            })
            .pipe(take(1))
            .subscribe((response) => {
                const status = response?.[0]?.status;
                const resolvedState: SubscriberPageState = status === 'archived' ? 'archived' : 'active';

                this.router.navigate([], {
                    queryParams: { state: resolvedState },
                    queryParamsHandling: 'merge', // keep msisdn, productId and other params
                    replaceUrl: true,             // do not push extra history entry
                });
            });
    }
}

export const PAGE_STATE = new InjectionToken<Signal<SubscriberPageState | null>>('PAGE_STATE', {
    providedIn: 'root',
    factory: () => inject(SubscriberPageStateService).state,
});
```

**Key implementation notes:**
- `state` signal is `null` while the API call is in-flight — widgets must guard against `null`
- `replaceUrl: true` prevents a duplicate browser history entry when state is written back to the URL
- `queryParamsHandling: 'merge'` preserves all other existing params (`msisdn`, `productId`, etc.)
- `take(1)` ensures the HTTP observable completes and does not leak

### Functional service — switch endpoint based on state

```ts
export function beSubscriberData(): (params: SubscriberReq) => Observable<SubscriberData> {
    const state = inject(PAGE_STATE);
    const activeService = beActiveSubscriberData();
    const archivedService = beArchivedSubscriberData();

    return (params) =>
        state() === 'active'
            ? activeService(params)
            : archivedService(params);
}
```

### Component — show/hide UI based on state

```ts
@Component({ ... })
export class SubscriberActionsComponent {
    protected readonly state = inject(PAGE_STATE);
}
```

```html
<button *ngIf="state() === 'active'" (click)="onActivate()">Activate</button>
<span *ngIf="state() === 'archived'" class="badge">Archived</span>
```

### Component — reload data reactively when state changes mid-session

```ts
@Component({ ... })
export class SubscriberWidgetComponent implements OnInit {
    private readonly state = inject(PAGE_STATE);
    private readonly loadData = beSubscriberData();
    public data$: Observable<SubscriberData>;

    public ngOnInit(): void {
        this.data$ = toObservable(this.state).pipe(
            filter((state) => state !== null),
            switchMap((state) => this.loadData({ state })),
        );
    }
}
```

---

## Preserving `?state` across navigation

Always pass `queryParamsHandling: 'preserve'` when navigating programmatically:

```ts
this.router.navigate(['/subscriber', id], { queryParamsHandling: 'preserve' });
```

Or in templates:

```html
<a [routerLink]="['/subscriber', id]" queryParamsHandling="preserve">Open</a>
```
