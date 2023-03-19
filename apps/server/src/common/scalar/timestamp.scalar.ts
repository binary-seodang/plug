import { GraphQLScalarType } from 'graphql'
import dayjs from 'dayjs'
function validate(time) {
  if (typeof time === 'number') {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  } else if (typeof time === 'string') {
    return dayjs(time).get('milliseconds')
  }
}

export const TimeStamp = new GraphQLScalarType({
  name: 'TimeStamp',
  description: 'TimeStamp Test Scalar',
  serialize: (value) => {
    if (typeof value === 'number') {
      return validate(value)
    }
    throw new Error('invalid type')
  },
  parseValue: (value) => {
    if (typeof value === 'string') {
      return validate(value)
    }
    throw new Error('invalid type')
  },
  // TODO : 해당 매소드 기능 확인 후 정의 필요
  parseLiteral: (ast: any) => {
    console.log(ast, 'parseLiteral')
    return 1
  },
})
