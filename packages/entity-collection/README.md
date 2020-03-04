###### Example
```typescript
export class VoteService extends EntityCollectionBase<XmEntity> {
    constructor(entityCollectionFactoryService: EntityCollectionFactoryService) {
        super(entityCollectionFactoryService.create('entity/api/_search/votes'));
    }
}
```

```typescript
public voteService: VoteService;

this.voteService.getAll().subscribe(...);
```