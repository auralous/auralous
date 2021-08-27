import { NullArray, Resolver, Variables } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

const dateFromObjectId = function (objectId: string) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

export const nextCursorPagination = (): Resolver<any, any, any> => {
  const offsetArgument = "next";
  const limitArgument = "limit";
  const compareArgs = (
    fieldArgs: Variables,
    connectionArgs: Variables
  ): boolean => {
    for (const key in connectionArgs) {
      if (key === offsetArgument || key === limitArgument) {
        continue;
      } else if (!(key in fieldArgs)) {
        return false;
      }

      const argA = fieldArgs[key];
      const argB = connectionArgs[key];

      if (
        typeof argA !== typeof argB || typeof argA !== "object"
          ? argA !== argB
          : stringifyVariables(argA) !== stringifyVariables(argB)
      ) {
        return false;
      }
    }

    for (const key in fieldArgs) {
      if (key === offsetArgument || key === limitArgument) {
        continue;
      }
      if (!(key in connectionArgs)) return false;
    }

    return true;
  };

  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const visited = new Set();
    let result: NullArray<string> = [];
    let prevOffset: string | null = null;

    for (let i = 0; i < size; i++) {
      const { fieldKey, arguments: args } = fieldInfos[i];
      if (args === null || !compareArgs(fieldArgs, args)) {
        continue;
      }

      const links = cache.resolve(entityKey, fieldKey) as string[];
      const currentOffset = (args[offsetArgument] as string | null) || null;

      if (
        links === null ||
        links.length === 0 ||
        (currentOffset && typeof currentOffset !== "string")
      ) {
        continue;
      }

      const tempResult: NullArray<string> = [];

      for (let j = 0; j < links.length; j++) {
        const link = links[j];
        if (visited.has(link)) continue;
        tempResult.push(link);
        visited.add(link);
      }

      if (
        !prevOffset ||
        (currentOffset &&
          dateFromObjectId(currentOffset).getTime() <
            dateFromObjectId(prevOffset).getTime())
      ) {
        result = [...result, ...tempResult];
      } else {
        result = [...tempResult, ...result];
      }

      prevOffset = currentOffset;
    }

    const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    if (hasCurrentPage) {
      return result;
    } else if (!(info as any).store.schema) {
      return undefined;
    } else {
      info.partial = true;
      return result;
    }
  };
};
