import { ApiProperty } from "@nestjs/swagger";
import { LoginDevice } from "@shared/prisma";

export class LoginDto {
    @ApiProperty({ type: "string" })
    email: string;
    @ApiProperty({ type: "string" })
    password: string;
    @ApiProperty({ enum: LoginDevice })
    device: LoginDevice;
}
