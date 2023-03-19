import { UsersService } from 'users/users.service'
import {
  Query,
  Mutation,
  Resolver,
  Args,
  ResolveReference,
} from '@nestjs/graphql'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { AuthUser } from 'auth/auth-user.decorator'
import { User } from './entities/user.entity'
import { Role } from 'auth/role.decorator'
import { UserProfileOutput } from './dtos/user-profile.dto'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string
    id: number
  }): Promise<User> {
    return this.usersService.findById(reference.id).then((res) => res.user)
  }

  @Query(() => UserProfileOutput)
  async getUser(@Args('id') id: number): Promise<UserProfileOutput> {
    return this.usersService.findById(id)
  }

  @Query(() => UserProfileOutput)
  @Role(['Any'])
  getMe(@AuthUser() user: User): UserProfileOutput {
    return { ok: true, user }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput) {
    return this.usersService.login(loginInput)
  }
}
