import { fromGlobalId as _fromGlobalId, toGlobalId as _toGlobalId } from 'graphql-relay';

type ObjectType = 'Episode' | 'Channel';

/**
 * オブジェクトのタイプとidからユニークなglobalIdを作成する関数
 * @param type オブジェクトのタイプ
 * @param id オブジェクトのid
 */
export function toGlobalId(type: ObjectType, id: string): string {
  return _toGlobalId(type, id);
}

/**
 * globalIdからオブジェクトのタイプとidを取得する関数
 * @param globalId ユニークなglobalId
 */
export function fromGlobalIdOrThrow(globalId: string): { type: ObjectType; id: string } {
  const { type, id } = _fromGlobalId(globalId);
  if (type !== 'Episode' && type !== 'Channel') {
    throw new Error('Invalid globalId');
  }
  return { type, id };
}
