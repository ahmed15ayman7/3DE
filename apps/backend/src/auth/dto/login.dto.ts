import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ type: "string" })
    email: string;
    @ApiProperty({ type: "string" })
    password: string;
    @ApiProperty({ type: "string" })
    device: string;
    @ApiProperty({ type: "string" })
    ip: string;
    @ApiProperty({ type: "string" })
    browser: string;
    @ApiProperty({ type: "string" })
    os: string;
}
