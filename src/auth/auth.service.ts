import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userSerivce: UserService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userSerivce.findOne(name);
    // console.log(user.password === password);
    console.log(user.password === password);
    if (user && user.password === password) {
      // const { password, ...rest } = user;

      return user;
    }

    return null;
  }

  async login(user: any) {
    const { name, password } = user;
    const userinfo = await this.prismaService.user.findUnique({
      where: { name },
    });
    console.log('22222', user);
    if (!user) {
      throw new NotFoundException();
    }

    const passwordValid = (await password) === userinfo.password;
    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    return {
      aceess_token: this.jwtService.sign({ name }),
      user,
    };
  }
}
