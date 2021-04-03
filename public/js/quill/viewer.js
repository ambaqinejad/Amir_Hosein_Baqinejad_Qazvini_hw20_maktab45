let quill;
$(document).ready(function() {

            quill = new Quill("#editor_viewer", {
                theme: "bubble"
            });
            quill.disable();

            let articleID = window.location.href.split("/");
            articleID = articleID[articleID.length - 1];
            console.log(articleID);
            $.ajax({
                        type: "post",
                        url: "/dashboard/getArticle",
                        data: { articleID },
                        success: function(article) {
                                quill.setContents(JSON.parse(article.article.content).ops)
                                let writerInfo = `
                <img src="${article.article.postedBy.avatar ? `images/avatars/${article.article.postedBy.avatar}` : 'images/avatars/default.jpg'}" alt="" class="mb-3 writer-avatar_container">
                <p><strong>Writer:</strong> ${article.article.postedBy.username}</p>
                <p class="mb-4"><strong>Writer Email:</strong> ${article.article.postedBy.email}</p>
                <p><strong>Created at:</strong> ${article.article.createdAt.substring(0, 10)}</p>
            `
            $('#writerInfo').html(writerInfo);
        },
        error: function(err) {

        }
    });
})