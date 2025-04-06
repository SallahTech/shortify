import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Ip,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LinksService } from './links.service';
import { CreateLinkDto, UpdateLinkDto } from './dto/link.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  // Protected routes
  @UseGuards(AuthGuard('jwt'))
  @Post('links')
  create(@Req() req: AuthRequest, @Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(req.user.sub, createLinkDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('links')
  findAll(@Req() req: AuthRequest) {
    return this.linksService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('links/:id')
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.linksService.findOne(req.user.sub, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('links/:id')
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return this.linksService.update(req.user.sub, id, updateLinkDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('links/:id')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.linksService.remove(req.user.sub, id);
  }

  // Public routes
  @Get('r/:shortId')
  async getRedirectInfo(@Param('shortId') shortId: string) {
    const link = await this.linksService.findByShortUrl(shortId);
    return {
      originalUrl: link.originalUrl,
      cta: link.ctaOverlay,
    };
  }

  @Post('r/:shortId/click')
  async recordClick(
    @Param('shortId') shortId: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const link = await this.linksService.findByShortUrl(shortId);
    await this.linksService.recordClick(link.id, ip, userAgent);
    return { success: true };
  }

  @Post('r/:shortId/cta-click')
  async recordCtaClick(
    @Param('shortId') shortId: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const link = await this.linksService.findByShortUrl(shortId);
    await this.linksService.recordClick(link.id, ip, userAgent, true);
    return { success: true };
  }
}
