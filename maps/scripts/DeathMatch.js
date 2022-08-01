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

        const civ = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(i), IID_Identity).GetCiv();
        for (const templateName of TechnologyTemplates.GetNames().filter(a => TechnologyTemplates.Has(a))) {

            if ((templateName === 'phase_city_generic' || templateName === 'phase_city' || templateName === 'phase_town_generic' || templateName === 'phase_town') && (civ === 'athen' || civ === 'pers')) {
                continue;
            }

            warn(uneval(civ));
            warn(uneval(templateName));

            cmpTechnologyManager.ResearchTechnology(templateName);
        }
    }
}
