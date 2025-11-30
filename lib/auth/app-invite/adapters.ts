import { AuthContext } from "better-auth";
import { AppInvitation, MODEL_NAME } from "./schema";
import { Role } from "../permissions";

export const getAppInviteAdapter = (ctx: AuthContext) => {
  const adapter = ctx.adapter;

  const createInivitation = async ({
    email,
    role,
  }: {
    email: string;
    role: Role;
  }) => {
    const createdAt = new Date();

    const newInvite = await adapter.create<AppInvitation>({
      model: MODEL_NAME,
      data: {
        email,
        role,
        createdAt,
      },
    });

    return newInvite;
  };

  const getInvitation = async (id: string) => {
    try {
      const invitation = await adapter.findOne<AppInvitation>({
        model: MODEL_NAME,
        where: [
          {
            field: "id",
            value: id,
          },
        ],
      });
      return invitation;
    } catch (error) {
      return null;
    }
  };

  const updateInvitation = async (id: string, data: Partial<AppInvitation>) => {
    await adapter.update<AppInvitation>({
      model: MODEL_NAME,
      where: [
        {
          field: "id",
          value: id,
        },
      ],
      update: data,
    });
  };

  const deleteInvitation = async (id: string) => {
    await adapter.delete<AppInvitation>({
      model: MODEL_NAME,
      where: [
        {
          field: "id",
          value: id,
        },
      ],
    });
  };

  const listInvitations = async () => {
    return await adapter.findMany<AppInvitation>({
      model: MODEL_NAME,
    });
  };

  return {
    createInivitation,
    getInvitation,
    updateInvitation,
    deleteInvitation,
    listInvitations,
  };
};
