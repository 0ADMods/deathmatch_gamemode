/**
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: © 2022 Stanislas Daniel Claude Dolcini
 */

{
    const cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
    if (!cmpPlayerManager)
        return;

    // Skip Gaia.
    for (let i = 1; i < cmpPlayerManager.GetNumPlayers(); ++i)
    {
        const cmpTechnologyManager = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(i), IID_TechnologyManager);
        if (!cmpTechnologyManager)
            continue;

        for (const templateName of TechnologyTemplates.GetNames().filter(a => TechnologyTemplates.Has(a)))
            cmpTechnologyManager.ResearchTechnology(templateName);
    }
}
