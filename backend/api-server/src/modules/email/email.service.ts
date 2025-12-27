import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

@Injectable()
export class EmailService {
  private transporter: Transporter
  private readonly logger = new Logger(EmailService.name)

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM') || 'noreply@example.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      }

      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Email sent successfully to ${options.to}`)
      return true
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = this.getWelcomeEmailTemplate(name)
    const text = `Welcome to our platform, ${name}! We're excited to have you on board.`

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Political Strategy Workbench',
      html,
      text,
    })
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`
    const html = this.getPasswordResetTemplate(name, resetUrl)
    const text = `Hi ${name}, click this link to reset your password: ${resetUrl}`

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
      text,
    })
  }

  async sendEmailVerification(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`
    const html = this.getEmailVerificationTemplate(name, verificationUrl)
    const text = `Hi ${name}, please verify your email: ${verificationUrl}`

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
      text,
    })
  }

  async sendPasswordChangedNotification(email: string, name: string): Promise<boolean> {
    const html = this.getPasswordChangedTemplate(name)
    const text = `Hi ${name}, your password was recently changed. If you didn't make this change, please contact us immediately.`

    return this.sendEmail({
      to: email,
      subject: 'Password Changed',
      html,
      text,
    })
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Political Strategy Workbench!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We're excited to have you on board! Your account has been successfully created.</p>
              <p>With Political Strategy Workbench, you can:</p>
              <ul>
                <li>Analyze news articles with AI-powered insights</li>
                <li>Manage political and business campaigns</li>
                <li>Develop strategic initiatives</li>
                <li>Track and monitor key developments</li>
              </ul>
              <p>Get started by logging in to your account:</p>
              <a href="${this.configService.get('FRONTEND_URL')}/login" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Political Strategy Workbench Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Political Strategy Workbench. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private getPasswordResetTemplate(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>This link will expire in 1 hour for security reasons.</p>
              <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
              </div>
              <p>For security purposes, this link can only be used once.</p>
              <p>Best regards,<br>The Political Strategy Workbench Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Political Strategy Workbench. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private getEmailVerificationTemplate(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for signing up! Please verify your email address to complete your registration:</p>
              <a href="${verificationUrl}" class="button">Verify Email</a>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p>Best regards,<br>The Political Strategy Workbench Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Political Strategy Workbench. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private getPasswordChangedTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Changed Successfully</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
              <div class="warning">
                <strong>Security Alert:</strong> If you didn't make this change, please contact our support team immediately and secure your account.
              </div>
              <p>Best regards,<br>The Political Strategy Workbench Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Political Strategy Workbench. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
