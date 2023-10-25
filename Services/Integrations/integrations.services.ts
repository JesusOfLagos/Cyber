import mongoose from "mongoose";

export interface IIntegration {
    name: string;
    description: string;
    logo: string;
    link: string;
    }


    const integrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    link: { type: String, required: true },
    });

    const Integration = mongoose.model<IIntegration & mongoose.Document>("Integration", integrationSchema);


export class IntegrationManager {
    static async addIntegration(name: string, description: string, logo: string, link: string) {
        const integration = new Integration({
            name,
            description,
            logo,
            link,
        });
        await integration.save();
        return integration;
    }

    static async getIntegrationById(id: string) {
        const integration = await Integration.findById(id);
        return integration;
    }

    static async getAllIntegrations() {
        const integrations = await Integration.find();
        return integrations;
    }

    static async updateIntegration(id: string, name: string, description: string, logo: string, link: string) {
        const integration = await Integration.findById(id);
        if (!integration) {
            return null;
        }
        integration.name = name;
        integration.description = description;
        integration.logo = logo;
        integration.link = link;
        await integration.save();
        return integration;
    }

    static async deleteIntegration(id: string) {
        const integration = await Integration.findByIdAndDelete(id);
        if (!integration) {
            return null;
        }
        return integration;
    }
}