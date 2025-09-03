
const { files, wikis, wikitrees } = require('./index.js');

// CouchDB的filter函数需要是纯JavaScript，不能包含ES6+语法？
const createUserFilter = function(doc, req) {
    if (!req.query || !doc) {
        return false;
    }
    
    var userId = req.query.userId;
    if (!userId || !doc.ownerId) {
        return false;
    }
    
    // 很坑， 这里获取到的类型可能不一样。
    if (String(doc.ownerId) === String(userId)) {
        return true;
    }
    
    return false;
};

// 为files数据库创建filter
const createFilesFilters = async () => {
    try {
        let existingDoc;
        try {
            existingDoc = await files.get('_design/shared');
        } catch (e) {
            // 如果不存在，existingDoc 保持 undefined
        }

        const newFilters = {
            filesByUser: createUserFilter.toString(),
        };

        if (existingDoc) {
            existingDoc.filters = newFilters;
            await files.put(existingDoc);
            console.log('Files database filters updated successfully');
        } else {
            await files.put({
                _id: '_design/shared',
                filters: newFilters
            });
            console.log('Files database design document created successfully');
        }
    } catch (e) {
        console.error('Error creating/updating files filters:', e);
    }
};

// 为wikis数据库创建filter
const createWikisFilters = async () => {
    try {
        let existingDoc;
        try {
            existingDoc = await wikis.get('_design/shared');
        } catch (e) {
            // 如果不存在，existingDoc 保持 undefined
        }

        const newFilters = {
            wikisByUser: createUserFilter.toString(),
        };

        if (existingDoc) {
            existingDoc.filters = newFilters;
            await wikis.put(existingDoc);
            console.log('Wikis database filters updated successfully');
        } else {
            await wikis.put({
                _id: '_design/shared',
                filters: newFilters
            });
            console.log('Wikis database design document created successfully');
        }
    } catch (e) {
        console.error('Error creating/updating wikis filters:', e);
    }
};

// 为wikitrees数据库创建filter
const createWikiTreesFilters = async () => {
    try {
        let existingDoc;
        try {
            existingDoc = await wikitrees.get('_design/shared');
        } catch (e) {
            // 如果不存在，existingDoc 保持 undefined
        }

        const newFilters = {
            wikiTreesByUser: createUserFilter.toString(),
        };

        if (existingDoc) {
            existingDoc.filters = newFilters;
            await wikitrees.put(existingDoc);
            console.log('WikiTrees database filters updated successfully');
        } else {
            await wikitrees.put({
                _id: '_design/shared',
                filters: newFilters
            });
            console.log('WikiTrees database design document created successfully');
        }
    } catch (e) {
        console.error('Error creating/updating wikitrees filters:', e);
    }
};

// 创建所有数据库的filter
const createAllFilters = async () => {
    await createFilesFilters();
    await createWikisFilters();
    await createWikiTreesFilters();
    console.log('All database filters created/updated successfully');
};

module.exports = {
    createAllFilters,
};