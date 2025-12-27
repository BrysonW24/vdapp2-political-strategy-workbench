import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean>;
    sendEmailVerification(email: string, name: string, verificationToken: string): Promise<boolean>;
    sendPasswordChangedNotification(email: string, name: string): Promise<boolean>;
    private getWelcomeEmailTemplate;
    private getPasswordResetTemplate;
    private getEmailVerificationTemplate;
    private getPasswordChangedTemplate;
}
