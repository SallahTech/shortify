import {
  IsString,
  IsUrl,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsHexColor,
} from "class-validator";
import { Type } from "class-transformer";
import { CtaPosition } from "@prisma/client";

export class CtaOverlayDto {
  @IsString()
  message: string;

  @IsString()
  buttonText: string;

  @IsUrl()
  buttonUrl: string;

  @IsEnum(CtaPosition)
  position: CtaPosition;

  @IsHexColor()
  color: string;
}

export class CreateLinkDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CtaOverlayDto)
  cta?: CtaOverlayDto;
}

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl()
  originalUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CtaOverlayDto)
  cta?: CtaOverlayDto;
}
