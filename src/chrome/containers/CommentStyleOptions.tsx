import * as React from "react";

import Checkbox from "../../components/Checkbox";
import Loading from "../../components/Loading";
import useChromeStorage from "../../hooks/useChromeStorage";
import {
  COMMENTS_STYLE_OPTS,
  COMMENTS_STYLE_OPT_DEFAULT,
} from "../../utils/options";

const CommentStyleOptions = () => {
  const [selected, setSelected, { loading }] = useChromeStorage<string>(
    "opt-comment-style",
    COMMENTS_STYLE_OPT_DEFAULT
  );

  if (loading) return <Loading />;

  return (
    <>
      <Checkbox
        inline
        options={COMMENTS_STYLE_OPTS}
        selected={[selected || COMMENTS_STYLE_OPT_DEFAULT]}
        onChange={(selected) => {
          setSelected(selected[selected.length - 1]);
        }}
      />
    </>
  );
};

export default CommentStyleOptions;
