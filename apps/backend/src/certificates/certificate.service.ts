import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from 'dtos/Certificate.create.dto';
import { UpdateCertificateDto } from 'dtos/Certificate.update.dto';
import { Academy, Certificate } from '@shared/prisma';
import { getCertificateHtml } from './certificate.template';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';
@Injectable()
export class CertificateService {
    constructor(private prisma: PrismaService) { }

    async create(createCertificateInput: CreateCertificateDto): Promise<Certificate> {
        const user = await this.prisma.user.findUnique({
          where: { id: createCertificateInput.userId },
        });
      
        if (!user) throw new NotFoundException(`User not found`);
        if (user.role !== 'STUDENT') throw new BadRequestException('User is not a student');
      
        const certificate = await this.prisma.certificate.create({
          data: createCertificateInput,
          include: { user: true },
        });
        const logoPath = path.join(process.cwd(), 'public/images/logo.png');
        const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        
        // بعد إنشاء الشهادة، أنشئ PDF
        const pdfUrl = await this.generateAndSavePDF({
          name: certificate.name,
          title: certificate.title,
          description: certificate.description,
          earnedAt: new Date(certificate.earnedAt).toLocaleDateString('ar-EG'),
          id: certificate.id,
          logoBase64: logoBase64,
        });
      
        // اختياري: تحديث الشهادة بالرابط
        await this.prisma.certificate.update({
          where: { id: certificate.id },
          data: { url: pdfUrl },
        });
      
        return certificate;
      }
      

    async findAll(): Promise<Certificate[]> {
        return this.prisma.certificate.findMany({
            include: {
                user: true,
            },
        });
    }

    async findByStudent(userId: string): Promise<Certificate[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${user.id} not found`);
        }

        return this.prisma.certificate.findMany({
            where: {
                userId: user.id,
            },
        });
    }

    async findOne(id: string): Promise<Certificate> {
        const certificate = await this.prisma.certificate.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        if (!certificate) {
            throw new NotFoundException(`Certificate with ID ${id} not found`);
        }

        return certificate;
    }

    async update(id: string, updateCertificateInput: UpdateCertificateDto): Promise<Certificate> {
        const certificate = await this.findOne(id);
        if (!certificate) {
            throw new NotFoundException(`Certificate with ID ${id} not found`);
        }

        return this.prisma.certificate.update({
            where: { id },
            data: updateCertificateInput,
            include: {
                user: true,
            },
        });
    }

    async remove(id: string): Promise<Certificate> {
        const certificate = await this.findOne(id);
        if (!certificate) {
            throw new NotFoundException(`Certificate with ID ${id} not found`);
        }

        return this.prisma.certificate.delete({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    async generateAndSavePDF(data: {
        name: string;
        title: string;
        description: string;
        earnedAt: string;
        id: string; // certificate ID
        logoBase64: string;
      }) {
        const html = getCertificateHtml(data);
        const pdfPath = path.join(process.cwd(), 'public/certificates', `${data.id}.pdf`);
      
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
      
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          landscape: true,
        });
      
        await browser.close();
        return `/certificates/file/${data.id}`; // يمكنك تخزين هذا الرابط في قاعدة البيانات
      }

    async getFile(id: string, res: Response): Promise<any> {
        const filePath = path.join(
            process.cwd(),
            'public/certificates',
            `${id}.pdf`,
          );
      
          if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Certificate PDF not found');
          }
      
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${id}.pdf"`,
          });
      
          return res.sendFile(filePath);
        
    }

}