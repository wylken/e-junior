import { prisma } from '@/lib/db';
import { Configuration, ConfigurationInput } from '@/types/config';

export class ConfigService {
  static async getConfigurations(): Promise<Configuration[]> {
    const configs = await prisma.configuration.findMany({
      orderBy: {
        key: 'asc',
      },
    });

    return configs.map(config => ({
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    }));
  }

  static async getConfigurationByKey(key: string): Promise<Configuration | null> {
    const config = await prisma.configuration.findUnique({
      where: { key },
    });

    if (!config) return null;

    return {
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }

  static async createConfiguration(data: ConfigurationInput): Promise<Configuration> {
    const existingConfig = await prisma.configuration.findUnique({
      where: { key: data.key },
    });

    if (existingConfig) {
      throw new Error('Já existe uma configuração com esta chave');
    }

    const config = await prisma.configuration.create({
      data: {
        key: data.key,
        value: data.value,
        type: data.type,
        description: data.description,
      },
    });

    return {
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }

  static async updateConfiguration(id: string, data: Partial<ConfigurationInput>): Promise<Configuration> {
    const existingConfig = await prisma.configuration.findUnique({
      where: { id },
    });

    if (!existingConfig) {
      throw new Error('Configuração não encontrada');
    }

    if (data.key && data.key !== existingConfig.key) {
      const keyExists = await prisma.configuration.findUnique({
        where: { key: data.key },
      });

      if (keyExists) {
        throw new Error('Já existe uma configuração com esta chave');
      }
    }

    const config = await prisma.configuration.update({
      where: { id },
      data: {
        key: data.key,
        value: data.value,
        type: data.type,
        description: data.description,
      },
    });

    return {
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }

  static async deleteConfiguration(id: string): Promise<void> {
    const existingConfig = await prisma.configuration.findUnique({
      where: { id },
    });

    if (!existingConfig) {
      throw new Error('Configuração não encontrada');
    }

    await prisma.configuration.delete({
      where: { id },
    });
  }

  static validateConfigValue(value: string, type: 'URL' | 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON'): boolean {
    switch (type) {
      case 'URL':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'NUMBER':
        return !isNaN(Number(value));
      case 'BOOLEAN':
        return value === 'true' || value === 'false';
      case 'JSON':
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      case 'TEXT':
        return true;
      default:
        return false;
    }
  }

  static formatConfigValue(value: string, type: 'URL' | 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON'): any {
    switch (type) {
      case 'NUMBER':
        return Number(value);
      case 'BOOLEAN':
        return value === 'true';
      case 'JSON':
        return JSON.parse(value);
      default:
        return value;
    }
  }
}