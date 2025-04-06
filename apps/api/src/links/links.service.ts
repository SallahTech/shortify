import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto, UpdateLinkDto } from './dto/link.dto';
import * as crypto from 'crypto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  private generateShortId(length: number = 8): string {
    return crypto.randomBytes(length).toString('base64url');
  }

  async create(userId: string, dto: CreateLinkDto) {
    const shortId = this.generateShortId(); // Generate a short ID for the URL

    return this.prisma.link.create({
      data: {
        originalUrl: dto.originalUrl,
        shortUrl: shortId,
        userId,
        ...(dto.cta && {
          ctaOverlay: {
            create: {
              message: dto.cta.message,
              buttonText: dto.cta.buttonText,
              buttonUrl: dto.cta.buttonUrl,
              position: dto.cta.position,
              color: dto.cta.color,
            },
          },
        }),
      },
      include: {
        ctaOverlay: true,
        clicks: {
          select: {
            id: true,
            createdAt: true,
            ctaClick: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      include: {
        ctaOverlay: true,
        clicks: {
          select: {
            id: true,
            createdAt: true,
            ctaClick: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
      include: {
        ctaOverlay: true,
        clicks: {
          select: {
            id: true,
            createdAt: true,
            ctaClick: true,
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async findByShortUrl(shortUrl: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortUrl },
      include: {
        ctaOverlay: true,
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async update(userId: string, id: string, dto: UpdateLinkDto) {
    // Check if link exists and belongs to user
    await this.findOne(userId, id);

    return this.prisma.link.update({
      where: { id },
      data: {
        ...(dto.originalUrl && { originalUrl: dto.originalUrl }),
        ...(dto.cta && {
          ctaOverlay: {
            upsert: {
              create: {
                message: dto.cta.message,
                buttonText: dto.cta.buttonText,
                buttonUrl: dto.cta.buttonUrl,
                position: dto.cta.position,
                color: dto.cta.color,
              },
              update: {
                message: dto.cta.message,
                buttonText: dto.cta.buttonText,
                buttonUrl: dto.cta.buttonUrl,
                position: dto.cta.position,
                color: dto.cta.color,
              },
            },
          },
        }),
      },
      include: {
        ctaOverlay: true,
        clicks: {
          select: {
            id: true,
            createdAt: true,
            ctaClick: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    // Check if link exists and belongs to user
    await this.findOne(userId, id);

    return this.prisma.link.delete({
      where: { id },
    });
  }

  async recordClick(
    linkId: string,
    ip?: string,
    userAgent?: string,
    ctaClick: boolean = false,
  ) {
    return this.prisma.click.create({
      data: {
        linkId,
        ip,
        userAgent,
        ctaClick,
      },
    });
  }
}
